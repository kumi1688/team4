<template>
    <h2>hue container</h2>
</template>

<script>
// import axios from 'axios';
import io from 'socket.io-client';
const socket = io('localhost:8080');

export default {
    created(){
      this.connectWebSocket();          
      this.updateBulbState();
    },
    methods:{
        connectWebSocket() {
            socket.on("connection", () => {
                console.log("웹소켓 연결됨");
            });
        },
        updateBulbState() {
            socket.on("bulbState", (data) => {
            console.log(data);
        // this.bulbState = data.on ? "켜짐" : "꺼짐";
            });
        }
    }
}
</script>