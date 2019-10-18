const pointGeometry = new THREE.TetrahedronBufferGeometry(PARTICLESIZE);

const pointMaterial =
    new THREE.PointsMaterial({
        color: 0xFFFFFF,
        opacity: 1.0,
        transparent: true,
});

class KrPoint extends THREE.Points{
    constructor(position, target, velocity, force, life, charge){
        
        var geometry = new THREE.BufferGeometry();
        geometry.vertices.push(particle1.getPosition()); //probably in error
        super(geometry, pointMaterial);
        this.receiveShadow = true;
        this.castShadow = true;
        this.name("KrPoint");

        this.userData.life = life;
        this.userData.charge = charge;
        this.userData.target = new Vector3().copy(target);
        this.userData.velocity = new Vector3().copy(velocity);
        this.userData.force = new Vector3().copy(force);

        this.userData.inPlace = false;
        this.userData.connectedLines = [];
        this.userData.connectedPolygons = [];

    }
    process(){
            //.onBeforeRender 

            //.onAfterRender
    }

    setVelocity(vx, vy, vz){ //TODO refactor this into vector3
        this.userData.velocity.setX(vx);
        this.userData.velocity.setY(vy);
        this.userData.velocity.setZ(vz);
    }
    setPosition(x,y,z){
        this.position.setX(x);
        this.position.setX(y);
        this.position.setX(z);
    }

    getPosition(){
        return this.position; //read-only which is what we want;
    }
    setTarget(newTarget){
        this.userData.target.copy(newTarget);
    }
    getTarget(){
        return this.userData.target;
    }
    setTarget(newTarget){
        this.userData.target.copy(newTarget);
    }
    getTarget(){
        return this.userData.target;
    }
    setTarget(newTarget){
        this.userData.target.copy(newTarget);
    }
    getTarget(){
        return this.userData.target;
    }
}



class PointParticle extends THREE.Mesh{
    constructor(param){
        var geometry;
        if(param.hasOwnProperty('geometry')){
            geometry = pointSettings.geometry.clone();
        }else{
            geometry = new THREE.TetrahedronBufferGeometry(param['size']);
        }
        var material;
        if(param.hasOwnProperty('material')){
            material = param['material'].clone();
        }else{
            material = new THREE.MeshLambertMaterial({
                color: 0xCC0000,
                transparency: true
            });
        }
        super(geometry, material);
        if(param.hasOwnProperty('position')){
            this.position.copy(param['position']);
        }

        for (var key in pointSettings) {
            if (this.hasOwnProperty(key)) {
                continue;
            } else {
                this.userData[key] = pointSettings[key];
                continue;
            }
        }
        this.userData.connectedLines = [];
    }

    setVelocity(newVel){ //TODO refactor this into vector3
        this.userData.vx = newVel.x;
        this.userData.vy = newVel.y;
        this.userData.vz = newVel.z;
    }
    setPosition(newPosition){
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
        this.position.z = newPosition.z;
    }
    getPosition(){
        return new THREE.Vector3(this.position.x,
        this.position.y,
        this.position.z);
    }
    setTarget(newTarget){
        this.userData.tx = newTarget.x;
        this.userData.ty = newTarget.y;
        this.userData.tz = newTarget.z;
    }
    getTarget(){
        return new THREE.Vector3(
        this.userData.tx,
        this.userData.ty,
        this.userData.tz);
    }

    addLine(line){
        this.userData.connectedLines.push(line);
    }

    checkLine(particle){
        for(var i = 0 ; i < this.userData.connectedLines.length; i++){
            var line = this.userData.connectedLines[i];
            if(line.userData.particleA.uuid == this.uuid && line.userData.particleB.uuid == particle.uuid){
                return true;
            }
            if(line.userData.particleB.uuid == this.uuid && line.userData.particleA.uuid == particle.uuid){
                return true;
            }
        }
        return false;
    }
}