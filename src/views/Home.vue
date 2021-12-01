<template>
  <v-container>
    <v-list two-line>
      <v-list-item-group v-model="selected">
        <template v-for="(list, idx1, idx2) in taskData">
          <v-list-item
            :key="idx1"
            @mouseenter="hovered = idx1"
            @mouseleave="hovered = null"
            @click="goToTaskList(idx1)"
          >
            <v-list-item-content>
              <v-list-item-title v-text="list.name"></v-list-item-title>
              <v-list-item-subtitle>
                {{ nbCompletedTask(list) }} tâche{{
                  nbCompletedTask(list) != 1 ? "s" : ""
                }}
                complétée{{ nbCompletedTask(list) != 1 ? "s" : "" }} sur
                {{ list.tasks.length }} ({{ percent(list) }} %)
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action v-if="hovered == idx1">
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-on="on"
                    v-bind="attrs"
                    @click.stop="exportTaskList(idx1)"
                  >
                    <v-icon>mdi-export-variant</v-icon>
                  </v-btn>
                </template>
                Exporter
              </v-tooltip>
            </v-list-item-action>

            <v-list-item-action v-if="hovered == idx1">
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-on="on"
                    v-bind="attrs"
                    @click.stop="renameTaskList(idx1)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                Renommer
              </v-tooltip>
            </v-list-item-action>

            <v-list-item-action v-if="hovered == idx1">
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-on="on"
                    v-bind="attrs"
                    @click.stop="deleteTaskList(idx1)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                Supprimer
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>

          <v-divider :key="idx2" v-if="idx1 < taskData.length - 1"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
    <v-menu offset-y top>
      <template #activator="{ on, attrs }">
        <v-btn
          v-on="on"
          v-bind="attrs"
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

      <v-list>
        <v-list-item-group>
          <v-list-item>
            <v-list-item-title @click="newTaskListDialog = true"
              >Vide</v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="importTaskListDialog = true"
              >À partir d'un fichier todo.txt</v-list-item-title
            >
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
    <v-dialog v-model="addOrImportTaskListDialog">
      <v-card>
        <v-card-title>
          <h3 v-if="newTaskListDialog">Nouvelle liste de tâche</h3>
          <h3 v-else>Importer une liste de tâche</h3>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-text-field
                label="Nom de la liste"
                v-model="taskListName"
                required
              ></v-text-field>
            </v-row>
            <v-row v-if="importTaskListDialog">
              <v-file-input
                v-model="importedFile"
                accept="text/plain"
                label="fichier todo.txt"
              >
              </v-file-input>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="
              newTaskListDialog = false;
              importTaskListDialog = false;
            "
          >
            Annuler
          </v-btn>
          <v-btn
            v-if="newTaskListDialog"
            color="blue darken-1"
            text
            @click="
              addTaskList(taskListName);
              newTaskListDialog = false;
            "
          >
            Créer
          </v-btn>
          <v-btn
            v-else
            color="blue darken-1"
            text
            @click="
              importTaskList(taskListName);
              importTaskListDialog = false;
            "
          >
            Importer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// @ is an alias to /src

var taskData = [];

if (!localStorage.getItem("taskData")) {
  localStorage.setItem("taskData", JSON.stringify(taskData));
} else {
  taskData = JSON.parse(localStorage.getItem("taskData"));
}

export default {
  name: "Home",
  data: function () {
    return {
      taskData,
      importedFile: null,
      newTaskListDialog: false,
      importTaskListDialog: false,
      taskListName: "",
      selected: null,
      hovered: null,
    };
  },

  watch: {
    taskData: function (newList) {
      localStorage.setItem("taskData", JSON.stringify(newList));
    },
  },

  computed: {
    addOrImportTaskListDialog: function () {
      return this.newTaskListDialog || this.importTaskListDialog;
    },
  },

  methods: {
    nbCompletedTask: function (list) {
      let res = 0;
      list.tasks.forEach((item) => {
        if (item.isCompleted) {
          res++;
        }
      });
      return res;
    },
    percent: function (list) {
      let ratio = this.nbCompletedTask(list) / list.tasks.length;
      if (isNaN(ratio)) {
        return 0;
      } else {
        return Math.round(ratio * 100);
      }
    },

    addTaskList: function (name) {
      if (name != "") {
        this.taskData.push({ name, tasks: [] });
      }
      this.taskListName = "";
    },
    renameTaskList: function (idx) {
      if (idx != null) {
        let name = prompt(
          "Nouveau nom de la liste (laissez vide pour annuler) :"
        );
        if (name != "" && name != null) {
          this.taskData[idx].name = name;
          localStorage.setItem("taskData", JSON.stringify(taskData));
        }
      }
    },
    deleteTaskList: function (idx) {
      if (
        idx != null &&
        confirm(
          "Voulez-vous vraiment supprimer cette liste et tout ce qu'il contient ?"
        )
      ) {
        this.taskData.splice(idx, 1);
      }
    },

    importTaskList: function (name) {
      if (this.importedFile != null) {
        let self = this;
        let listText = [];
        let taskList = [];

        let todoPatterns = {
          completion: /^x (?<date>\d{4}-\d{2}-\d{2})/,
          priority: /\((?<imp>[A-Z])\) /,
          task: /(?<=\([A-Z]\) |\d{4}-\d{2}-\d{2} |^(?!x|\([A-Z]\) |\d{4}-\d{2}-\d{2} ))(?<text>\w[^+@]*)(?= | @| \+|$)/,
          category: /(?<=\+)(?<ctg>\w+)/g,
          context: /(?<=@)(?<ctxt>\w+)/g,
        };

        this.importedFile.text().then(function (txt) {
          listText = txt.split("\n");
          console.log("listText: ", listText)
          listText.forEach(function (task) {
            if (task == "") return

            let taskProperty = {
              name: "",
              priority: "",
              categories: [],
              contexts: [],
              tags: {},
              isCompleted: false,
              completionDate: new Date().toLocaleDateString("fr-FR"),
            };

            console.log("todoPtrn: ", task.match(todoPatterns.task))

            taskProperty.name = task.match(todoPatterns.task).groups.text;
            taskProperty.priority =
              task.match(todoPatterns.priority)?.groups.imp ?? "";
            taskProperty.categories =
              task.match(todoPatterns.category) ?? [];
            taskProperty.contexts =
              task.match(todoPatterns.context) ?? [];
            taskProperty.isCompleted =
              task.match(todoPatterns.completion) != null;
            taskProperty.completionDate = task.match(
              todoPatterns.completion
            )?.groups.date;
            taskProperty.completionDate = new Date(taskProperty.completionDate).toLocaleDateString("fr-FR")

            taskList.push(taskProperty);
          });

          self.taskData.push({
            name,
            tasks: taskList,
          });
        });
      }
    },

    exportTaskList: function(idx) {
      let text = ""
      let taskList = this.taskData[idx]
      let datePtrn = /(?<j>\d{2})\/(?<m>\d{2})\/(?<a>\d{4})/

      taskList.tasks.forEach(function(task) {
        text += (task.isCompleted) ? ("x "+ task.completionDate.replace(datePtrn, "$<a>-$<m>-$<j>") + " ") : ""
        text += (task.priority != "") ? ("(" + task.priority + ") ") : ""
        text += task.name + " "
        text += (task.categories.length != 0) ? "+" + task.categories.join(" +") + " " : ""
        text += (task.contexts.length != 0) ? "@" + task.contexts.join(" @") + " " : ""
        text += "\n"
      })

      let link = document.createElement('a')

      link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
      link.setAttribute('download', taskList.name + "_todo.txt")
      link.style.display = 'none'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    goToTaskList: function (idx) {
      this.$router.push({ name: "Task", params: { id: idx } });
    },
  },
};
</script>
