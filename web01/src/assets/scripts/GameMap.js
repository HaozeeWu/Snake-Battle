import { AcGameObject } from "./AcGameObject";
import { Wall } from "./Wall";
import { Snake } from "./Snake";

export class GameMap extends AcGameObject {
    // ctx 画布，parent 画布的父元素，动态改变
    constructor(ctx, parent, store) {
        // 先创建游戏地图，后创建障碍物
        super();

        this.ctx = ctx;
        this.parent = parent;
        this.store = store;
        // 绝对距离
        this.L = 0;

        this.rows = 13;
        this.cols = 14;
        this.inner_walls_count = 20;
        this.walls = [];

        this.snakes = [
            new Snake({id: 0, color: "#4876EC", r: this.rows - 2, c: 1}, this),
            new Snake({id: 1, color: "#F94848", r: 1, c: this.cols - 2}, this),
        ];

    
    }
    // 判断生成障碍物的连通性
    // check_connectivity(g, sx, sy, tx, ty) {
    //     if (sx == tx && sy == ty) {
    //         return true;
    //     }

    //     g[sx][sy] = true;
    //     let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
    //     for (let i = 0; i < 4; i++){
    //         let x = sx + dx[i], y = sy + dy[i];
    //         if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
    //             return true;
    //     }
    //     return false;
    // }

    create_walls() {
        const g = this.store.state.pk.gamemap; // 已经在后端生成

        // const g = [];
        // for (let r = 0; r < this.rows; r++) {
        //     g[r] = [];
        //     for (let c = 0; c < this.cols; c++) {
        //         g[r][c] = false;
        //     }
        // }

        // // 给四周加上障碍物
        // for (let r = 0; r < this.rows; r ++) {
        //     g[r][0] = g[r][this.cols - 1] = true;
        // }
        // for (let c = 0; c < this.cols; c ++) {
        //     g[0][c] = g[this.rows - 1][c] = true;
        // }
        // // 创建随机障碍物
        // for (let i = 0; i < this.inner_walls_count; i++) {
        //     for (let j = 0; j < 1000; j++){
        //         let r = parseInt(Math.random() * this.rows);
        //         let c = parseInt(Math.random() * this.cols);
        //         // g[this.rows - 1 - r][this.cols - 1 - c]代表中心对称
        //         if (g[r][c] || g[this.rows - 1 - r][this.cols - 1 - c]) continue;
        //         if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)
        //             continue;
        //         g[r][c] = g[this.rows - 1 - r][this.cols - 1 - c] = true;
        //         break;
        //     }
        // }
        // const copy_g = JSON.parse(JSON.stringify(g))
        // if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) return false;
        
        for (let r = 0; r < this.rows; r ++) {
            for (let c = 0; c < this.cols; c ++){
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }

        
        
        // return true;
    }

    add_listening_events() {
        if (this.store.state.record.is_record) {
            let k = 0;
            const a_steps = this.store.state.record.a_steps;
            const b_steps = this.store.state.record.b_steps;
            const loser = this.store.state.record.record_loser;
            const [snake0, snake1] = this.snakes;
            const interval_id = setInterval(() => {
                if (k >= a_steps.length - 1) {
                    if (loser === "all" || loser === "A") {
                        snake0.status = "die";
                    }
                    if (loser === "all" || loser === "B") {
                        snake1.status = "die";
                    }
                    clearInterval(interval_id);
                } else {
                    snake0.set_direction(parseInt(a_steps[k]));
                    snake1.set_direction(parseInt(b_steps[k]));
                    k ++;
                }
            }, 300)
        } else {
            this.ctx.canvas.focus();
            this.ctx.canvas.addEventListener("keydown",e => {
                let d = -1;
                if (e.key === 'w') d = 0;
                else if (e.key === 'd') d = 1;
                else if (e.key === 's') d = 2;
                else if (e.key === 'a') d = 3;
    
                if (d >= 0) {
                    this.store.state.pk.socket.send(JSON.stringify({
                        event: "move",
                        direction: d,
                    }));
                }
            });
        }
       
    }

    start() {
        // 随机出有连通性的障碍物，为false将一直随机建立
        // for (let i = 0; i < 1000; i++)
        //     if (this.create_walls())
        //         break;
        this.create_walls();

        this.add_listening_events();
    }
    // 计算画布的长宽，parent为父div
    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready() { // 判断两条蛇是否都准备好下一回合了
        for (const snake of this.snakes) {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1) return false;
        }
        return true;
    }

    next_step() {   // 让两条蛇进入下一回合
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    check_valid(cell) { // 检测目标位置是否合法，没有撞到两条蛇的身体和障碍物
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c) {
                return false;
            }
        }

        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) { // 这一回合不增长的时候,即蛇尾前进的时候，蛇尾不参与判断
                k--;
            }
            for (let i = 0; i < k; i++) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c){
                    return false;
                }
            }
        }
        return true;
    }

    // 每一帧执行一次
    update() {
        this.update_size();
        if (this.check_ready()) {
            this.next_step();
        }
        this.render();
    }

    render() {
        // this.ctx.fillStyle = 'green';
        // this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // this.ctx.fillRect(10, 10, 150, 50);

        // 奇偶数不同颜色
        const color_even = "#AAD751", coler_odd = "#A2D149";
        for (let r = 0; r < this.rows; r++){
            for (let c = 0; c < this.cols; c++) {
                if(( r + c ) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = coler_odd;
                }
                // 按照划定的像素区域填充 前两个变量为起始坐标
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }


        
    }
}