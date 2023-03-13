const execSync = require("child_process").execSync;


    function run_in_shell(cmd) {// : string
        const out = execSync(cmd, { skipThrow: false });
        const out_string = new TextDecoder('utf-8').decode(out);
        return out_string;
    }


    function create_container_name(name){
        let d = new Date().getTime();
        return name+d;
    }
    //Will substitute start_ogr_containername as this takes a folder on the host as an argument, making it more flexible
    function start_gdal(name, srcFolder){
        let hostPath=process.env.PWD + '/' + srcFolder + '/';
        let cmd = `docker run --name ${name} -di --restart unless-stopped -v ${hostPath}:/tmp:rw osgeo/gdal:alpine-normal-latest`
        this.run_in_shell(cmd);
        console.log(name);
        return name;
    }


    function start_ogr_containerNImage(name){// : void
        let tempPath=process.env.PWD + '/temp/';
        let cmd = `docker run --name ${name} -di --restart unless-stopped -v ${tempPath}:/tmp:rw osgeo/gdal:alpine-normal-latest`
        this.run_in_shell(cmd);
        console.log(name);
        return name;
    }
    

    function clean_container (container_name){// : void
        run_in_shell(`docker rm -f ${container_name}`);
    }


    function exec_docker(name, cmd){
        const wholecmd = `docker exec -i ${name} sh -c "${cmd}"`;   
        return this.run_in_shell(wholecmd);
    }


module.exports = {
    run_in_shell, 
    create_container_name,
    start_gdal,
    start_ogr_containerNImage,
    clean_container, 
    exec_docker    
};
