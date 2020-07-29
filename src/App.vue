<!-- TODO: Page params when switching pages; Vuex for global data storage; Upload documents after redirecting going back issues  -->

<template>
  <div id="app">
    <div id="nav">
      
    </div>
    <div id="container">
    <router-view/>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  /* padding: 30px; */
  /* margin-top: auto;
  margin-bottom: auto; */
}

#container{
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
  justify-content: center;
  position: absolute;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.flex{
  display: flex;
  flex-direction: column;
  justify-content: center;

}
</style>
