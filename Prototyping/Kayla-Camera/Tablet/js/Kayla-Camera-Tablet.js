(function() {

    "use strict";
    
    var EVENT_BRIDGE_OPEN_MESSAGE = "eventBridgeOpen",
        UPDATE_UI = "update_ui",
        UPDATE_CONFIG_NAME = "updateConfigName",
        UPDATE_CONFIG = "updateConfig",
        UPDATE_CONFIG_LIST = "UPDATE_CONFIG_LIST",
        ENABLE_CUSTOM_LISTENER = "enableCustomListener",
        DISABLE_CUSTOM_LISTENER = "disableCustomListener",
        UPDATE_CUSTOM_LISTENER = "updateCustomListener",
        ADD_CAMERA_POSITION = "addCameraPosition",
        EDIT_CAMERA_POSITION_KEY = "editCameraPositionKey",
        REMOVE_CAMERA_POSITION = "removeCameraPosition",
        EDIT_CAMERA_POSITION_NAME = "editCameraPositionName",
        CHANGE_AVATAR_TO_CAMERA = "changeAvatarToCamera",
        CHANGE_AVATAR_TO_INVISIBLE = "changeAvatarToInvisible",
        TOGGLE_AVATAR_COLLISIONS = "toggleAvatarCollisions",
        DELETE_CONFIG = "deleteConfig",
        EDIT_DEFAULT = "editDefault",
        EDIT_BRAKE = "editBrake",
        EVENTBRIDGE_SETUP_DELAY = 100;

    Vue.component('config', {
        props: ["config_name", "configs"],
        data: function(){
            return {
                newName: "",
                JSONURL: "Replace with the JSON URL",
                editing: false,
                editingConfigs: false,
                showConfigs: false,
                inSavedConfigs: false
            }
        },
        methods: {
            saveConfigs(){
                this.$parent.saveConfigs();
            },
            selectConfigs(){
                this.editingConfigs = true;
            },
            editName(name){
                this.editing = true;
            },
            goBack(){
                this.editingConfigs = false;
            },
            updateName(name){
                this.editing = false;
                EventBridge.emitWebEvent(JSON.stringify({
                    type: UPDATE_CONFIG_NAME,
                    value: name
                }));
                this.newName = "";
            },
            changeAvatarToCamera(){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: CHANGE_AVATAR_TO_CAMERA
                }));
            },
            changeAvatarToInvisible(){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: CHANGE_AVATAR_TO_INVISIBLE
                }));
            },
            toggleAvatarCollisions(){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: TOGGLE_AVATAR_COLLISIONS
                }));
            },
            toggleConfigs(){
                this.showConfigs = !this.showConfigs;
            },
            sendConfig(config){
                this.toggleConfigs();
                EventBridge.emitWebEvent(JSON.stringify({
                    type: UPDATE_CONFIG,
                    value: config.settings
                }));
            },
            deleteConfig(config, index){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: DELETE_CONFIG,
                    value: this.config_name,
                    index: index
                }));
            }
        },
        template:`
            <div class="card">
                <div class="card-header">
                <strong>Config Name: {{config_name}}</strong></br>
                <button class="btn-sm btn-primary mt-1 mr-1 float-left" v-if="!editing" v-on:click="editName()">Edit Name</button> 
                <button class="btn-sm btn-warning mt-1 mr-1 float-right" v-if="!editing" v-on:click="deleteConfig()">Delete Config</button> 
                    <div v-if="editing">
                        <input id="new-name" type="text" class="form-control" v-model="newName">
                        <button class="btn-sm btn-primary mt-1 mr-1" v-on:click="updateName(newName)">Update Name</button>
                    </div>
                </div>
                <div class="card-body">
                    <div v-if="!editingConfigs">
                        <button v-if="" class="btn-sm btn-primary mt-1 mr-1" v-on:click="selectConfigs()">Load JSON Config</button>
                        <button class="btn-sm btn-primary mt-1 mr-1" v-on:click="saveConfigs()">Save Configuration</button>
                    </div>
                    <div v-if="editingConfigs">
                        <div class="dropdown">
                            <button class="btn-sm btn-primary mt-1 mr-1" id="selectedType" v-on:click="toggleConfigs()">Configs</button>
                            <ul class="dropdown-type">
                                <div id="typeDropdown" class="dropdown-items" :class="{ show: showConfigs }">
                                    <li v-for="(config, index) in configs" v-on:click="sendConfig(config, index)">{{ config.config_name }}</li>
                                </div>
                            </ul>
                            <button class="btn-sm btn-primary mt-1 mr-1" v-on:click="goBack()">Go Back</button>
                        </div>
                    </div>
                    <div>
                        <button class="btn-sm btn-primary mt-1 mr-1" v-on:click="changeAvatarToCamera()">Use Camera Avatar</button>
                        <button class="btn-sm btn-primary mt-1 mr-1" v-on:click="changeAvatarToInvisible()">Use Invisible Avatar</button>
                    </div>
                    <div>
                        <button class="btn-sm btn-primary mt-1 mr-1" v-on:click="toggleAvatarCollisions()">Toggle Avatar Collisions</button>
                    </div>
                </div>
            </div>
        `
    })

    Vue.component('listener', {
        props: ["is_enabled", "position", "orientation", "mode"],
        data: function(){
            return {
                enabled: false,
            }
        },
        methods: {
            disableCustom(){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: DISABLE_CUSTOM_LISTENER,
                    value: false
                }));
            },
            enableCustom(){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: ENABLE_CUSTOM_LISTENER,
                    value: true
                }));
            },
            updateListening(){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: UPDATE_CUSTOM_LISTENER
                }));
            }
        },
        template: `
            <div class="card">
                <div class="card-header">
                    <strong>Custom Listener</strong>
                </div>
                <div class="card-body">
                    <div>
                        <div>
                            <strong>Current Mode:</strong> {{mode}}
                        </div>
                        <div v-if="is_enabled">
                            <strong>Position: </strong>
                            <br>
                            <div>x: {{position.x.toFixed(2)}} <strong>|</strong> y: {{position.y.toFixed(2)}} <strong>|</strong> z: {{position.z.toFixed(2)}}</div>
                            <strong>Orientation: </strong> 
                            <br>
                            <div>x: {{orientation.x.toFixed(2)}} <strong>|</strong> y: {{orientation.y.toFixed(2)}} <strong>|</strong> z: {{orientation.z.toFixed(2)}} <strong>|</strong> w: {{orientation.z.toFixed(2)}}</div>
                        </div>
                        <button class="btn-sm btn-primary mt-1 mr-1" v-if="!is_enabled" v-on:click="enableCustom()">Enable Custom</button>
                        <button class="btn-sm btn-primary mt-1 mr-1" v-if="is_enabled" v-on:click="disableCustom()">Disable Custom</button>
                        <button class="btn-sm btn-primary mt-1 mr-1" v-if="is_enabled" v-on:click="updateListening()">Update Listening</button>

                    </div>
                </div>
            </div>
        `
    })

    Vue.component('position', {
        props: ["name", "key_press", "position", "orientation"],
        data: function(){
            return {
                newKey: "",
                newName: "",
                editingKey: false,
                editingName: false,
            }
        },
        methods: {
            remove(key){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: REMOVE_CAMERA_POSITION,
                    value: key
                }));
            },
            editKey(){
                this.editingKey = true;
            },
            updateKey(key){
                this.editingKey = false;
                EventBridge.emitWebEvent(JSON.stringify({
                    type: EDIT_CAMERA_POSITION_KEY,
                    value: {
                        key: this.key_press,
                        newKey: key
                    }
                }));
                this.newKey = "";
            },
            editName(){
                this.editingName = true;
            },
            updateName(name){
                this.editingName = false;
                EventBridge.emitWebEvent(JSON.stringify({
                    type: EDIT_CAMERA_POSITION_NAME,
                    value: {
                        name: name,
                        key: this.key_press
                    }
                }));
                this.newName = "";
            },
        },
        template: `
            <div class="card">
                <div class="card-header">
                    <div>
                    <strong>{{name}}</strong> <button class="btn-sm btn-primary mt-1 mr-1 float-right" v-if="!editingName" v-on:click="editName()">Edit Name</button>
                    </div>
                    
                        <div v-if="editingName">
                            <input id="new-name" type="text" class="form-control" v-model="newName">
                            <button class="btn-sm btn-primary mt-1 mr-1" v-on:click="updateName(newName)">Update Name</button>
                        </div>
                </div>
                <div class="card-body">
                    <div>
                    <strong>Key: </strong>{{key_press}} <button class="float-right btn-sm btn-primary mt-1 mr-1" v-if="!editingKey" v-on:click="editKey()">Edit Key</button>
                        
                        <div v-if="editingKey">
                            <input id="new-key" type="text" class="form-control" v-model="newKey">
                            <button class="btn-sm btn-primary mt-1 mr-1" v-on:click="updateKey(newKey)">Update Key</button>
                        </div>
                        <div>
                        <strong>Position: </strong>
                        <br>
                        <div>x: {{position.x.toFixed(2)}} <strong>|</strong> y: {{position.y.toFixed(2)}} <strong>|</strong> z: {{position.z.toFixed(2)}}</div>
                        <strong>Orientation: </strong>
                        <br>
                        <div>x: {{orientation.x.toFixed(2)}} <strong>|</strong> y: {{orientation.y.toFixed(2)}} <strong>|</strong> z: {{orientation.z.toFixed(2)}} <strong>|</strong> w: {{orientation.z.toFixed(2)}}</div>
                        </div>
                    </div>
                    <button class="btn-sm btn-primary mt-1 mr-1 float-right" v-on:click="remove(key_press)">remove</button>
                </div>
            </div>
        `
    })

    Vue.component('move_options', {
        props: ["move"],
        methods: {
            onBlur: function(){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: EDIT_DEFAULT,
                    value: this.move
                }));
            }
        },
        template: /*html*/`
        <div class="card">
            <div class="card-header">
                move options
            </div>
            <div class="card-body">
            
                <form class="form-inline">
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">DRAG_COEFFICIENT</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="move.DRAG_COEFFICIENT" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">MAX_SPEED</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="move.MAX_SPEED" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">ACCELERATION</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="move.ACCELERATION" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">MOUSE_YAW_SCALE</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="move.MOUSE_YAW_SCALE" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">MOUSE_PITCH_SCALE</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="move.MOUSE_PITCH_SCALE" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">MOUSE_SENSITIVITY</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="move.MOUSE_SENSITIVITY" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">W</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="move.W" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    
                </form>
            </div>
        </div>
        `
    })

    Vue.component('brake_options', {
        props: ["brake"],
        methods: {
            onBlur: function(){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: EDIT_DEFAULT,
                    value: this.brake
                }));
            }
        },
        template: /*html*/`
        <div class="card">
            <div class="card-header">
                brake options
            </div>
            <div class="card-body">
            
                <form class="form-inline">
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">DRAG_COEFFICIENT</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="brake.DRAG_COEFFICIENT" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">MAX_SPEED</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="brake.MAX_SPEED" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">ACCELERATION</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="brake.ACCELERATION" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">MOUSE_YAW_SCALE</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="brake.MOUSE_YAW_SCALE" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">MOUSE_PITCH_SCALE</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="brake.MOUSE_PITCH_SCALE" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">MOUSE_SENSITIVITY</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="brake.MOUSE_SENSITIVITY" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    <div class="input-group mb-1 ">
                        <div class="input-group-prepend">
                            <span class="input-group-text main-font-size font-weight-bold">W</span>
                        </div>
                        <input type="text" v-on:blur="onBlur" v-model="brake.W" class="form-control main-font-size" placeholder="start frame">
                    </div>
                    
                </form>
            </div>
        </div>
        `
    })

    var app = new Vue({
        el: '#app',
        data: {
            settings: {
                configName: "Please name the config",
                mapping: {},
                listener: {
                    isCustomListening: false,
                    customPosition: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    customOrientation: {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 0
                    }
                }
            }
        },
        methods: {
            saveConfigs(){
                var removedConfigSettings = Object.assign({}, app.settings, {configs: []});
                fetch(app.settings.settingsURL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(removedConfigSettings),
                })
                .then(data => {
                    EventBridge.emitWebEvent(JSON.stringify({
                        type: UPDATE_CONFIG_LIST
                    }));
                })
                .catch(error => console.error(error));
            },
            createPosition(){
                EventBridge.emitWebEvent(JSON.stringify({
                    type: ADD_CAMERA_POSITION,
                    value: {
                        name: "Update the name",
                        key: "Update the key press"
                    }
                }));
            }
        } 
    });

    function onScriptEventReceived(message) {
        var data;
        try {
            data = JSON.parse(message);
            switch (data.type) {
                case UPDATE_UI:
                    app.settings = data.value;
                default:
            }
        } catch (e) {
            console.log(e)
            return;
        }
    }

    function onLoad() {
        
        // Initial button active state is communicated via URL parameter.
        // isActive = location.search.replace("?active=", "") === "true";

        setTimeout(function () {
            // Open the EventBridge to communicate with the main script.
            // Allow time for EventBridge to become ready.
            EventBridge.scriptEventReceived.connect(onScriptEventReceived);
            EventBridge.emitWebEvent(JSON.stringify({
                type: EVENT_BRIDGE_OPEN_MESSAGE
            }));
        }, EVENTBRIDGE_SETUP_DELAY);
    }

    onLoad();

}());