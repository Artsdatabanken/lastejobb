const execSync = require("child_process").execSync;

var docker_ops = {
    run_in_shell: function (cmd) {// : string
        const out = execSync(cmd, { skipThrow: false });
        const out_string = new TextDecoder('utf-8').decode(out);
        return out_string;
    },
    create_container_name: function (name){
        let d = new Date().getTime();
        return name+d;
    },
    start_ogr_containerNImage: function (name){// : void
        let tempPath=process.env.PWD + '/temp/';
        let cmd = `docker run --name ${name} -di --restart unless-stopped -v ${tempPath}:/tmp:rw osgeo/gdal:alpine-normal-latest`
        this.run_in_shell(cmd);
        console.log(name);
        return name;
    },
    clean_container: function (container_name){// : void
        this.run_in_shell(`docker rm -f ${container_name}`);
    },
    exec_docker: function (name, cmd){
        const wholecmd = `docker exec -i ${name} sh -c "${cmd}"`;   
        return this.run_in_shell(wholecmd);
    }
};


module.exports = docker_ops