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
            @click="goToTaskList(idx1)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="list.name"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-action v-if="hovered == idx1">
                <v-btn icon @click.stop="renameTaskList(idx1)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-list-item-action>

              <v-list-item-action v-if="hovered == idx1">
                <v-btn icon @click.stop="deleteTaskList(idx1)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>

            </v-list-item>

            <v-divider :key="idx2" v-if="idx1 < taskData.length-1"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
      <v-dialog v-model="newTaskListDialog">
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
            Nouvelle liste de tâche
          </v-btn>
        </template>

        <v-card>
          <v-card-title>
            <h3>Nouvelle liste de tâche</h3>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-text-field label="Nom de la liste" v-model="taskListName" required></v-text-field>
              </v-row>

            </v-container>
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="newTaskListDialog = false"
          >
            Annuler
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="addTaskList(taskListName); newTaskListDialog = false"
          >
            Ok
          </v-btn>
        </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script>
// @ is an alias to /src

var taskData = []

if (!localStorage.getItem("taskData")) {
  localStorage.setItem("taskData", JSON.stringify(taskData))
} else {
  taskData = JSON.parse(localStorage.getItem("taskData"))
}

export default {
  name: 'Home',
  data: function() {
    return {
      taskData,
      newTaskListDialog: false,
      taskListName: '',
      selected: null,
      hovered: null,
    }
  },

  watch: {
    taskData: function(newList) {
      localStorage.setItem("taskData", JSON.stringify(newList))
    }
  },
  methods: {
    addTaskList: function (name) {
      if (name != '') {
        this.taskData.push({name, tasks: []})
      }
      this.taskListName = ''
    },
    renameTaskList: function (idx) {
      if (idx != null) {
        let name = prompt("Nouveau nom de la liste (laissez vide pour annuler) :")
        if (name != '' && name != null) {
          this.taskData[idx].name = name
          localStorage.setItem("taskData", JSON.stringify(taskData))
        }
      }
    },
    deleteTaskList: function(idx) {
      if (idx != null && confirm("Voulez-vous vraiment supprimer cette liste et tout ce qu'il contient ?")) {     
        this.taskData.splice(idx, 1)
      }
    },
    goToTaskList: function (idx) {
      this.$router.push({name: 'Task', params: {id: idx}})
    }
  }
}
</script>
