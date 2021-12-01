<template>
  <v-container>
    <v-row class="d-flex align-baseline">
      <v-col cols="2">
        <v-btn icon @click="goBack()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="4">
        {{ taskData.name }}
      </v-col>
    </v-row>
    <v-list two-line>
      <v-list-item-group v-model="selected">
        <template v-for="(list, idx1, idx2) in taskData.tasks">
          <v-list-item
            :key="idx1"
            @mouseenter="hovered = idx1"
            @mouseleave="hovered = null"
          >
            <v-list-item-action>
              <v-checkbox
                v-model="list.isCompleted"
                @click="saveTaskList(taskData.tasks)"
              >
              </v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title v-text="list.name"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-action v-if="hovered == idx1">
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-on="on"
                    v-bind="attrs"
                    @click.stop="
                      taskProperty = list;
                      modifyTaskDialog = true;
                    "
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                Modifier
              </v-tooltip>
            </v-list-item-action>

            <v-list-item-action v-if="hovered == idx1">
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-on="on"
                    v-bind="attrs"
                    @click.stop="deleteTask(idx1)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                Supprimer
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>

          <v-divider
            :key="idx2"
            v-if="idx1 < taskData.tasks.length - 1"
          ></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
    <v-btn
      @click="newTaskDialog = true"
      fixed
      color="primary"
      large
      bottom
      right
    >
      <v-icon>mdi-plus</v-icon>
      Nouvelle tâche
    </v-btn>
    <v-dialog v-model="addOrModifyDialog" max-width="600px">
      <v-card class="new-task-dialog">
        <v-card-title>
          <h3 v-if="newTaskDialog">Nouvelle tâche</h3>
          <h3 v-else>Modifier la tâche</h3>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-text-field
                label="Nom de la tâche"
                v-model="taskProperty.name"
                required
              ></v-text-field>
            </v-row>
            <v-row>
              <v-checkbox
                v-model="toggleOptions"
                label="Afficher les options avancées"
              ></v-checkbox>
            </v-row>
            <template v-if="toggleOptions">
              <v-row>
                <v-combobox
                  v-model="taskProperty.priority"
                  :items="priorityItem"
                  label="Priorité"
                  type=""
                >
                </v-combobox>
              </v-row>
              <v-row>
                <v-combobox
                  v-model="taskProperty.categories"
                  label="Catégories"
                  multiple
                  chips
                >
                </v-combobox>
              </v-row>
              <v-row>
                <v-combobox
                  v-model="taskProperty.contexts"
                  label="Contextes"
                  multiple
                  chips
                >
                </v-combobox>
              </v-row>
            </template>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="
              clearTaskProperty();
              newTaskDialog = false;
              modifyTaskDialog = false;
            "
          >
            Annuler
          </v-btn>
          <v-btn
            v-if="newTaskDialog"
            color="blue darken-1"
            text
            @click="
              addTask();
              newTaskDialog = false;
            "
          >
            Ajouter
          </v-btn>
          <v-btn
            v-else
            color="blue darken-1"
            text
            @click="
              renameTask(hovered);
              modifyTaskDialog = false;
            "
          >
            Modifier
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "Task",

  data: function () {
    return {
      taskData: [],
      newTaskDialog: false,
      modifyTaskDialog: false,
      toggleOptions: false,
      priorityItem: " ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
      taskProperty: {
        name: "",
        priority: "",
        categories: [],
        contexts: [],
        tags: {},
        isCompleted: false,
        completionDate: new Date().toLocaleDateString("fr-FR"),
      },
      hovered: null,
      selected: null,
    };
  },

  computed: {
    addOrModifyDialog: function () {
      return this.newTaskDialog || this.modifyTaskDialog;
    },
  },

  created: function () {
    let taskListData = JSON.parse(localStorage.getItem("taskData"));
    this.taskData = taskListData[this.$route.params.id];

    this.$watch("taskData.tasks", this.saveTaskList);
  },

  methods: {
    addTask: function () {
      if (this.taskProperty.name != "") {
        this.taskData.tasks.push(this.taskProperty);
      }

      this.clearTaskProperty();
    },
    renameTask: function (idx) {
      if (idx != null) {
        this.taskData.tasks[idx] = this.taskProperty;
      }

      this.clearTaskProperty();
    },
    deleteTask: function (idx) {
      if (
        idx != null &&
        confirm("Voulez-vous vraiment supprimer cette tâche ?")
      ) {
        this.taskData.tasks.splice(idx, 1);
      }
    },

    saveTaskList: function (newList) {
      
      let taskListData = JSON.parse(localStorage.getItem("taskData"));
      newList.forEach((elmt, idx) => {
        if (elmt.isCompleted && !taskListData[this.$route.params.id].tasks[idx].isCompleted) elmt.completionDate = new Date().toLocaleDateString("fr-FR");
      });

      taskListData[this.$route.params.id].tasks = newList;
      localStorage.setItem("taskData", JSON.stringify(taskListData));
    },

    goBack: function () {
      this.$router.go(-1);
    },

    clearTaskProperty: function () {
      this.taskProperty = new Object({
        name: "",
        priority: "",
        categories: [],
        contexts: [],
        tags: {},
        completionDate: new Date().toLocaleDateString("fr-FR"),
        isCompleted: false,
      });
    },
  },
};
</script>
