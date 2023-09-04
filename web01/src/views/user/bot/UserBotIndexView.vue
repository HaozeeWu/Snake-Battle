<template>
    <div class="container">
        <div class="row">
            <div class="col-3">
                <div class="card" style="margin-top: 20px;">
                    <div class="card-body">
                        <img :src="$store.state.user.photo" alt="" style="width: 100%">
                    </div>
                </div>
            </div>
            <div class="col-9">
                <div class="card" style="margin: 20px;">
                    <div class="card-header">
                        <span style="font-size: 130%">我的Bot</span>
                        <button type="button" class="btn btn-success float-end" data-bs-toggle="modal" data-bs-target="#add-bot-btn">创建Bot</button>
                    
                        <!-- Modal -->
                        <div class="modal fade" id="add-bot-btn" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title fs-5">创建Bot</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label for="add-bot-title" class="form-label">名称</label>
                                    <input v-model="botadd.title" type="text" class="form-control" id="add-bot-title" placeholder="请输入Bot名称">
                                </div>
                                <div class="mb-3">
                                    <label for="add-bot-description" class="form-label">简介</label>
                                    <textarea v-model="botadd.description" class="form-control" id="add-bot-description" rows="3" placeholder="请输入Bot简介"></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="add-bot-code" class="form-label">代码</label>
                                    <VAceEditor
                                        v-model:value="botadd.content"
                                        @init="editorInit"
                                        lang="c_cpp"
                                        theme="textmate"
                                        style="height: 300px" />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <div class="error-message">{{ botadd.error_message }}</div>
                                <button type="button" class="btn btn-primary" @click="add_bot">创建</button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>名称</th>
                                    <th>创建时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="bot in bots" :key="bot.id">
                                    <td>{{ bot.title }}</td>
                                    <td>{{ bot.createtime }}</td>
                                    <td>
                                        <!--  修改时,在这里为每一个modal绑定一个bot.id -->
                                        <button type="button" class="btn btn-light" data-bs-toggle="modal" :data-bs-target="'#update-bot-modal-' + bot.id">修改</button>
                                        
                                        <!-- Modal -->
                                        <div class="modal fade" :id="'update-bot-modal-' + bot.id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog modal-xl">
                                            <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">修改Bot</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="mb-3">
                                                    <label for="add-bot-title" class="form-label">名称</label>
                                                    <input v-model="bot.title" type="text" class="form-control" id="add-bot-title" placeholder="请输入Bot名称">
                                                </div>
                                                <div class="mb-3">
                                                    <label for="add-bot-description" class="form-label">简介</label>
                                                    <textarea v-model="bot.description" class="form-control" id="add-bot-description" rows="3" placeholder="请输入Bot简介"></textarea>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="add-bot-code" class="form-label">代码</label>
                                                    <VAceEditor
                                                        v-model:value="bot.content"
                                                        @init="editorInit"
                                                        lang="c_cpp"
                                                        theme="textmate"
                                                        style="height: 300px" />
                                                </div>
                                            </div>
                                            <div class="modal-footer">
                                                <div class="error-message">{{ bot.error_message }}</div>
                                                <button type="button" class="btn btn-primary" @click="update_bot(bot)">保存修改</button>
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                                            </div>
                                            </div>
                                        </div>
                                        </div>

                                        <button type="button" class="btn btn-danger" @click="remove_bot(bot)">删除</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { ref,reactive } from 'vue'
import $ from 'jquery'
import { useStore } from 'vuex'
import { Modal } from 'bootstrap/dist/js/bootstrap.min.js'
import { VAceEditor } from 'vue3-ace-editor'
import ace from 'ace-builds'



export default {
    components:{
        VAceEditor
    },
    setup() {
        ace.config.set(
            "basePath", 
            "https://cdn.jsdelivr.net/npm/ace-builds@" + require('ace-builds').version + "/src-noconflict/");
        const store = useStore();
        let bots = ref([]);

        const botadd = reactive({
            title: "",
            description: "",
            content: "",
            error_message: "",
        });

        const refresh_bots = () => {
            $.ajax({
                url: "https://app5881.acapp.acwing.com.cn/api/user/bot/getlist/",
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token
                },
                success(resp) {
                    bots.value = resp;
                }
            })

        }
        refresh_bots();

        const add_bot = () => {
            botadd.error_message = "";
            $.ajax({
                url: "https://app5881.acapp.acwing.com.cn/api/user/bot/add/",
                type: "POST",
                data: {
                    title: botadd.title,
                    description: botadd.description,
                    content: botadd.content,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        // 创建成功后使填的内容清空
                        botadd.title = "";
                        botadd.description = "";
                        botadd.content = "";
                        botadd.error_message = "";
                        // 创建成功后隐藏modal
                        Modal.getInstance("#add-bot-btn").hide();
                        refresh_bots();
                    } else {
                        botadd.error_message = resp.error_message;
                    }
                }
            })
        }

        const remove_bot = (bot) => {
            botadd.error_message = "";
            $.ajax({
                url: "https://app5881.acapp.acwing.com.cn/api/user/bot/remove/",
                type: "POST",
                data: {
                    bot_id: bot.id,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        refresh_bots();
                    }
                }
                })
            }
        
        const update_bot = (bot) => {
            bot.error_message = "",
            $.ajax({
                url: "https://app5881.acapp.acwing.com.cn/api/user/bot/update/",
                type: "POST",
                data: {
                    bot_id: bot.id,
                    title: bot.title,
                    description: bot.description,
                    content: bot.content,
                },
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        // 修改成功后隐藏modal
                        Modal.getInstance('#update-bot-modal-' + bot.id).hide();
                        refresh_bots();
                    } else {
                        botadd.error_message = resp.error_message;
                    }
                }
            })
        }
        return {
            bots,
            botadd,
            add_bot,
            remove_bot,
            update_bot,
        }
        // $.ajax({
        //     url: "http://127.0.0.1:3000/user/bot/add/",
        //     type: "POST",
        //     data: {
        //         title: "Bot的标题",
        //         description : "Bot的描述",
        //         content : "Bot的代码",
        //     },
        //     headers: {
        //         Authorization: "Bearer " + store.state.user.token,
        //     },
        //     success(resp) {
        //         console.log(resp);
        //     },
        //     error(resp) {
        //         console.log(resp);
        //     }

        // })
        // $.ajax({
        //     url: "http://127.0.0.1:3000/user/bot/remove/",
        //     type: "POST",
        //     data: {
        //         bot_id: 5,
        //     },
        //     headers: {
        //         Authorization: "Bearer " + store.state.user.token,
        //     },
        //     success(resp) {
        //         console.log(resp);
        //     },
        //     error(resp) {
        //         console.log(resp);
        //     }

        // })
        // $.ajax({
        //     url: "http://127.0.0.1:3000/user/bot/update/",
        //     type: "POST",
        //     data: {
        //         bot_id: 1,
        //         title: "Bot的标题111",
        //         description : "Bot的描述222",
        //         content : "Bot的代码333",
        //     },
        //     headers: {
        //         Authorization: "Bearer " + store.state.user.token,
        //     },
        //     success(resp) {
        //         console.log(resp);
        //     },
        //     error(resp) {
        //         console.log(resp);
        //     }

        // })
        // $.ajax({
        //     url: "http://127.0.0.1:3000/user/bot/getlist/",
        //     type: "GET",
        //     headers: {
        //         Authorization: "Bearer " + store.state.user.token,
        //     },
        //     success(resp) {
        //         console.log(resp);
        //     },
        //     error(resp) {
        //         console.log(resp);
        //     }

        // })
    }
    
}
</script>

<style scoped>
div.error-message {
    color: red;
}
</style>