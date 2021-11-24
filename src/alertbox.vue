<template>
  <div>
    <transition-group name="alertTransition" tag="div">
      <div
        v-for="(alert, identifier) in alerts"
        :key="alert.identifier"
        :style="
          'position: fixed; width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; z-index: ' +
          String(100000000 + (alert.stackLevel ? alert.stackLevel : 0)) +
          '; background: transparent; background-color: rgba(0, 0, 0, 0.3);'
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
      </div>
    </transition-group>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data: () => ({
    alerts: {},
    alertStack: [],
    alertQueue: new window.Queue(),
  }),
  props: {
    vm: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.$Global.alert = this;
  },
  methods: {
    async pushAlert(
      title,
      message,
      // type supports destructive, normal and cancel
      actions = [
        {
          title: "OK",
          handler: null, // This is useless for type cancel.
          type: "cancel",
        },
      ]
    ) {
      let prom = new Promise((resolve) => {
        let identifier = Math.floor(Math.random() * 10000000);
        this.alertQueue.queue(
          ((that) => {
            return () => {
              Vue.set(that.alerts, identifier, {
                identifier: identifier,
                title: title,
                message: message,
                stackLevel: this.alertStack.length,
                actions: actions,
              });
              that.alertStack.push(identifier);
              Vue.nextTick(function () {
                that.$refs["alert_" + identifier][0].focus();
              }, that);
              that.alertQueue.dequeue();

              resolve(identifier);
            };
          })(this)
        );
      });
      return prom;
    },
    async popAlert(identifier = null) {
      let prom = new Promise((resolve) => {
        this.alertQueue.queue(
          ((that) => {
            return () => {
              if (identifier == null) {
                identifier = this.alertStack[this.alertStack.length - 1];
              }
              if (that.alerts[identifier] == undefined) {
                that.alertQueue.dequeue();
                resolve(false);
                return;
              }
              Vue.delete(that.alerts, identifier);
              // delete this.alerts[identifier];
              that.alertStack.splice(that.alertStack.indexOf(identifier), 1);
              Vue.nextTick(() => {
                setTimeout(() => {
                  // if (this.alertQueue[0] == alertProgressIdentifier) {
                  that.alertQueue.dequeue();
                  resolve(true);
                  // }
                }, 300);
              });
            };
          })(this)
        );
      });
      return prom;
    },
    popAlertInline(identifier) {
      // return function () {
      this.popAlert(identifier);
      // };
    },
    handlerProxy(identifier, actionIndex) {
      this.alerts[identifier].actions[actionIndex].handler(identifier);
      this.popAlert(identifier);
    },
  },
};
</script>

<style scoped>
.alertAction:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.alertAction:active {
  background-color: rgba(0, 0, 0, 0.2);
}
.alertTransition-enter-active,
.alertTransition-leave-active {
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.alertTransition-enter
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: scale(1.2);
}
.alertTransition-leave-to {
  opacity: 0;
}
</style>