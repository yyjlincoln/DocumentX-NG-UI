<template>
  <div>
    <alert-box
      v-for="(alert, identifier) in alerts"
      :key="identifier"
      :style="
        'position: fixed; width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; z-index: ' +
        String(100000000 + (alert.stackLevel ? alert.stackLevel : 0)) +
        '; background: transparent; background-color: rgba(0, 0, 0, 0.3); backdrop-filter: saturate(180%) blur(20px);'
      "
      :ref="'alert_' + identifier"
    >
      <div
        style="
          display: flex;
          flex-direction: column;
          background-color: white;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
          width: 350px;
          border-radius: 1em;
          overflow: hidden;
          filter: drop-shadow(0px 0px 5em gray);
          font-size: 1.3em;
        "
      >
        <div style="padding: 1.5em 1.5em 0em 1.5em">
          <div style="font-weight: bold">
            <!-- Title -->
            {{ alert.title }}
          </div>
          <div style="font-weight: plain; margin-top: 0.5em">
            <!-- Title -->
            {{ alert.message }}
          </div>
        </div>
        <div
          style="margin: 1em 0em 0em 0em; display: flex; overflow: hidden"
          :style="
            alert.actions.length == 2
              ? 'flex-direction: row; justify-content: space-evenly; flex-wrap: wrap;'
              : 'flex-direction: column;'
          "
        >
          <div
            v-for="(action, index) in alert.actions"
            :key="index"
            style="position: relative; flex-grow: 1; max-width: 100%"
            class="alertAction"
          >
            <div v-if="action.type == 'cancel'">
              <div
                style="
                  padding: 0.7em 0.7em 0.7em 0.7em;
                  border-top: 0.1px solid rgba(0, 0, 0, 0.1);
                  font-weight: bold;
                  cursor: pointer;
                  color: #2364aa;
                  overflow-wrap: break-word;
                  text-align: center;
                "
                :style="
                  alert.actions.length == 2
                    ? 'border-left: 0.1px solid rgba(0, 0, 0, 0.1);'
                    : ''
                "
                @click="popAlertInline(identifier)"
              >
                {{ action.title }}
              </div>
            </div>
            <div v-if="action.type == 'normal'">
              <div
                style="
                  padding: 0.7em 0.7em 0.7em 0.7em;
                  border-top: 0.1px solid rgba(0, 0, 0, 0.1);
                  font-weight: bold;
                  cursor: pointer;
                  color: #2364aa;
                  overflow-wrap: break-word;
                  text-align: center;
                "
                :style="
                  alert.actions.length == 2
                    ? 'border-left: 0.1px solid rgba(0, 0, 0, 0.1);'
                    : ''
                "
                @click="handlerProxy(identifier, index)"
              >
                {{ action.title }}
              </div>
            </div>
            <div v-if="action.type == 'destructive'">
              <div
                style="
                  padding: 0.7em 0.7em 0.7em 0.7em;
                  border-top: 0.1px solid rgba(0, 0, 0, 0.1);
                  font-weight: bold;
                  cursor: pointer;
                  color: #f34213;
                  overflow-wrap: break-word;
                  text-align: center;
                "
                :style="
                  alert.actions.length == 2
                    ? 'border-left: 0.1px solid rgba(0, 0, 0, 0.1);'
                    : ''
                "
                @click="handlerProxy(identifier, index)"
              >
                {{ action.title }}
              </div>
            </div>
            <!-- <div v-if="action.type"></div> -->
          </div>
        </div>
      </div>
    </alert-box>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>