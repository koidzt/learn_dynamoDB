<template>
  <div id="app">
    <p>
      userUid : {{ userUid }}
      <button @click="fetchAll">Fetch</button>
    </p>

    <div>
      <input type="text" v-model="inputText" />
      <button @click="insert">Add/Insert</button>
    </div>

    <table>
      <tbody>
        <tr v-for="item in todoList" :key="item.todoUid">
          <td>[{{ item.complete ? 'X' : ' ' }}]</td>
          <td>{{ item.todoUid }}</td>
          <td>{{ item.value }}</td>
          <td>{{ item.click || '-' }}</td>
          <td>
            <button @click="update(item)">{{ item.complete ? 'Undo' : 'Done' }}</button>
          </td>
          <td>
            <button @click="remove(item)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import aws from './awsInstance';

const TABLE = 'Learn_DynamoDB_Todo_List';
export default {
  name: 'App',

  data() {
    return {
      // {
      //   userUid: '1234',
      //   timestamp: 122345432,
      //   value: 'LEARN DYNAMODB',
      //   complete: false,
      // }
      todoList: [],

      userUid: '1234',
      inputText: '',
    };
  },

  methods: {
    async fetchAll() {
      var params = {
        TableName: TABLE,
        KeyConditionExpression: 'userUid = :hkey',
        ExpressionAttributeValues: {
          ':hkey': '1234',
        },
      };

      let data = await aws.documentClient.query(params).promise();
      /*eslint-disable no-debugger*/
      // console.log(data);
      this.todoList = data.Items;
    },
    async insert() {
      let data = {
        userUid: this.userUid,
        timestamp: new Date().valueOf(),
        value: this.inputText,
        complete: false,
      };

      var params = {
        TableName: TABLE,
        Item: data,
      };

      await aws.documentClient.put(params).promise();
      alert('add data completed.');
    },
    async update(item) {
      var params = {
        TableName: TABLE,
        Key: { userUid: item.userUid, timestamp: item.timestamp },
        UpdateExpression: 'SET #complete = :complete, lastUpdate = :lastUpdate   ADD click :clickIncrement', //เหมือนกับเป็นการเขียน String ที่ประกาศว่ามันจะทำอะไรบ้าง
        //Expression คือสมการ ดังนั้น UpdateExpression ในที่นี้หมายถึงสมการการอัพเดต
        //#หน้าตัวแปรหมายถึงตัวแปร คือ name ส่วน :หน้าตัวแปรหมายถึงตัวแปรนั้น คือ attribute value
        //lastupdate คือการ SET ค่าใหม่เข้าไปในข้อมูล
        ExpressionAttributeNames: { '#complete': 'complete' },
        ExpressionAttributeValues: {
          ':complete': !item.complete,
          ':lastUpdate': new Date().toString(),
          ':clickIncrement': 1, //ใส่เลขอะไรไว้ค่าจะเพิ่มขึ้นตามจำนวนนั้นต่อ 1 ครั้งการแก้ไข
        },
      };

      await aws.documentClient.update(params).promise();
      alert('UPDATE Completed.');
    },
    async remove(item) {
      try {
        var params = {
          TableName: TABLE,
          ConditionExpression: 'click <:clickCount',
          Key: {
            userUid: item.userUid,
            timestamp: item.timestamp,
          },
          ExpressionAttributeValues: {
            ':clickCount': 3,
          },
        };
        await aws.documentClient.delete(params).promise();
        alert('Deleted.');
      } catch (error) {
        alert('Fail.\n' + error);
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: start;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
