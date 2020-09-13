// var state = null;
// var count = 0;
cc.Class({
    extends: cc.Component,

    properties: {
        worth: cc.Node,
        worthSpeed: 0.6,
        player: cc.Node,
        objectNode: cc.Node,
        prefab1: cc.Prefab,
        prefab2: cc.Prefab,
        prefab3: cc.Prefab,
        prefab4: cc.Prefab,
        prefab5: cc.Prefab,
        cloudNode: cc.Node,
        cloud1: cc.Prefab,
        cloud2: cc.Prefab,
        cloud3: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.cloudInit();
        cc.director.getPhysicsManager().enabled = true;
        this.objectInit();
    },

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.count = 0;
        this.state = 1;
    },
    onTouchStart() {
        if (this.state) {

            var anim = this.player.getComponent(cc.Animation);
            anim.play('jump');
            cc.tween(this.player)
                .to(0.5, { position: cc.v2(0, 90) }, { easing: 'quadOut' })
                .to(0.5, { position: cc.v2(0, -44) })
                .start()

            var animJump = anim.getAnimationState('jump');
            animJump.on('finished', this.onFinished, this)//完成回调

        }
        this.state = 0;

        // this.objectInit();
    },
    onFinished() {//动画完成的回调函数
        console.log("完成")
        var anim = this.player.getComponent(cc.Animation);
        anim.play('run');

        this.state = 1;
    },
    objectInit() {
        this.lastObjectAngle = -45;
        this.objectNodeArr = [];
        for (i = 0; i < 4; i++) {
            var a = Math.floor(Math.random() * 5);
            if (a == 0) { object = this.prefab1 };
            if (a == 1) { object = this.prefab2 };
            if (a == 2) { object = this.prefab3 };
            if (a == 3) { object = this.prefab4 };
            if (a == 4) { object = this.prefab5 };
            this.objects = cc.instantiate(object);
            // this.objects = cc.instantiate(this.prefab4);
            this.objectNode.addChild(this.objects);
            this.objects.x = 600;
            // this.objects.angle = -45;
            this.objects.angle = this.lastObjectAngle;
            this.objectNodeArr.push(this.objects)

            this.lastObjectAngle -= 20;
        }
    },
    cloudInit() {
        var a1 = Math.floor(Math.random() * 3);
        if (a1 == 0) { this.clouds = this.cloud1 };
        if (a1 == 1) { this.clouds = this.cloud2 };
        if (a1 == 2) { this.clouds = this.cloud3 };
        this.cloud = cc.instantiate(this.clouds);
        // this.cloud = cc.instantiate(this.prefab4);
        this.cloudNode.addChild(this.cloud)
        this.cloud.x = 600;
        this.cloud.angle = -45;
    },
    update(dt) {
        this.player.x = 0;
        this.worth.angle = (this.worth.angle + this.worthSpeed) % 360;

        this.cloud.angle = (this.cloud.angle + this.worthSpeed - 0.4) % 360;
        let rad = Math.PI * (this.cloud.angle + 90) / 180//角度转弧度
        let r = this.worth.width / 2 + 200;//半径
        this.cloud.x = this.worth.x + r * Math.cos(rad);
        this.cloud.y = this.worth.y + r * Math.sin(rad);
        // console.log(this.cloud.angle)//打印云朵的angle
        if (this.cloud.angle > 45) {//销毁重建
            this.cloud.destroy();
            this.cloudInit();
        }

        //objects
        for (this.objects of this.objectNodeArr) {
            this.objects.angle = (this.objects.angle + this.worthSpeed - 0.3) % 360;
            let obRad = Math.PI * (this.objects.angle + 90) / 180;
            let obR = this.worth.width / 2 * 0.6 + this.objects.height / 2 * this.objects.scale;
            // console.log(this.objects.scale)
            this.objects.x = this.worth.x + obR * Math.cos(obRad);
            this.objects.y = this.worth.y + obR * Math.sin(obRad);

            if (this.objects.angle > 15) {
                this.objects.active = false;
                this.objects.destroy();
                this.count += 1;
                console.log(this.count);
                if(this.count >= 3){
                    this.objectInit();
                    this.count = 0;
                }
            }
        }

    },
});
