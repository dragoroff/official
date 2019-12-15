<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
}
.lead {
  font-size: 1.25rem;
  font-weight: 300;
}
.lead .text-success {
  color: #28a745;
}
.el-row {
  margin-bottom: 50px;
}
h1 {
  font-size: 2rem;
  color: #6c757d;
  font-weight: 400;
}
li {
  list-style: none;
  cursor: pointer;
}
</style>
