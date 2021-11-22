<template>
    <v-container>
      <v-data-table
        :items="taskData"
      >
      </v-data-table>
    </v-container>
</template>

<script>
// @ is an alias to /src

var taskData = {}

if (!localStorage.getItem("taskData")) {
  localStorage.setItem("taskData", taskData)
} else {
  taskData = localStorage.getItem("taskData")
}

export default {
  name: 'Home',
  data: function() {
    return {
      taskData
    }
  }
}
</script>
