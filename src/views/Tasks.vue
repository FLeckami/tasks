<template>
    <v-container>
      <v-list two-line>
        <v-list-item-group
        v-model="selected"
        >
          <template v-for="(list, idx1, idx2) in taskData">
            <v-list-item
            :key="idx1"
            @mouseenter="hovered = idx1"
            @mouseleave="hovered = null"
            >
                <v-list-item-action>
                    <v-checkbox
                    v-model="taskData[idx1].isCompleted"
                    @click="saveTaskList(taskData)"
                    >
                    </v-checkbox>
                </v-list-item-action>

                <v-list-item-content>
                    <v-list-item-title v-text="list.name"></v-list-item-title>
                </v-list-item-content>

                <v-list-item-action v-if="hovered == idx1">
                    <v-btn icon @click.stop="renameTask(idx1)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                </v-list-item-action>

                <v-list-item-action v-if="hovered == idx1">
                    <v-btn icon @click.stop="deleteTask(idx1)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </v-list-item-action>

            </v-list-item>

            <v-divider :key="idx2" v-if="idx1 < taskData.length-1"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
      <v-dialog v-model="newTaskDialog">
        <template #activator="{on, attr}">
          <v-btn
          v-on="on"
          v-bind="attr"
          fixed
          color="primary"
          large
          bottom
          right
          >
            <v-icon>mdi-plus</v-icon>
            Nouvelle tâche
          </v-btn>
        </template>

        <v-card>
          <v-card-title>
            <h3>Nouvelle tâche</h3>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-text-field label="Nom de la tâche" v-model="taskName" required></v-text-field>
              </v-row>

            </v-container>
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="newTaskDialog = false"
          >
            Annuler
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="addTask(taskName); newTaskDialog = false"
          >
            Ok
          </v-btn>
        </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
</template>


<script>


export default {
    name: 'Task',

    data: function() { 
        return {
            taskData: [],
            newTaskDialog: false,
            taskName: '',
            hovered: null,
            selected: null,

        }
    },

    watch: {
        taskData: 'saveTaskList'
    },

    created: function() {
        let taskListData = JSON.parse(localStorage.getItem("taskData"))
        this.taskData = taskListData[this.$route.params.id].tasks
        console.log(this.taskData)
    },

    methods: {
        addTask: function(name) {
            if (name != '') {
                this.taskData.push({
                    name,
                    isCompleted: false
                })
            }
        },
        renameTask: function() {

        },
        deleteTask: function(idx) {
            if (idx != null && confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
                this.taskData.splice(idx, 1)
            }
        },

        saveTaskList: function(newList) {
            let taskListData = JSON.parse(localStorage.getItem("taskData"))
            taskListData[this.$route.params.id].tasks = newList
            localStorage.setItem("taskData", JSON.stringify(taskListData))
        }
    }
    
}
</script>