<template>
    <ContentField v-if="show_content">
        <div class="row justify-content-md-center">
            <div class="col-3">
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <label for="username" class="form-label">用户名</label>
                        <input v-model="username" type="text" class="form-control" id="username" placeholder="请输入用户名">
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">密码</label>
                        <input v-model="password" type="password" class="form-control" id="password" placeholder="请输入密码">
                    </div>
                    <div class="error-message">{{ error_message }}</div>
                    <button type="submit" class="btn btn-primary">提交</button>
                </form>
            </div>
        </div>
    </ContentField>
    <div class="prompt-box" v-if="$store.state.pk.status === 'matching'">
        已注册的测试账号：
        <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">用户名</th>
                <th scope="col">密码</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">1</th>
                <td>test1</td>
                <td>p1</td>
                </tr>
                <tr>
                <th scope="row">2</th>
                <td>test2</td>
                <td>p2</td>
                </tr>
            </tbody>
        </table>
        
        因为目前匹配池里可能没有玩家在线匹配，若使用同一台机器体验, 请使用两个不同的浏览器分别登录两个账号, 进行PK对战
    </div>
</template>


<script>
import ContentField from '../../../components/ContentField.vue'
import {useStore} from 'vuex'
import { ref } from 'vue'
import router from '../../../router'

export default {
    components: {
        ContentField
    },
    setup() {
        const store = useStore();
        let username = ref('');
        let password = ref('');
        let error_message = ref('');
        let show_content = ref(false);

        const jwt_token = localStorage.getItem("jwt_token");
        if (jwt_token) {
            store.commit("updateToken", jwt_token);
            store.dispatch("getinfo", {
                success() {
                    console
                    router.push({name: "home"});
                },
                error() {
                    // 当前token过期，则执行error里的
                    show_content.value = true;
                }
            })
        } else {
            show_content.value = true;
        }

        const login = () => {
            error_message.value = "";
            store.dispatch("login", {
                username: username.value,
                password: password.value,
                success() {
                    store.dispatch('getinfo', {
                        success() {
                            router.push({ name: 'home' });
                        }
                    });
                },
                error() {
                    error_message.value = "用户名或密码错误";
                }
            })
        }

        return {
            username,
            password,
            error_message,
            login,
            show_content
        }
    }
}
</script>

<style scoped>
div.error-message {
    color: red;
}
button {
    width: 100%;
}
div.prompt-box {
    text-align: center;
    color: rgb(14, 8, 8);
    font-size: 20px;
    font-weight: 600;
    padding-left: 35%;
    padding-right: 35%;
    padding-top: 20px;
}
</style>