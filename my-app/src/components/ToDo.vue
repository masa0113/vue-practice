<template>
  <div id="app">
    <div class="new-todo">
      <div class="new-todo-item">
        <label for="new-todo-title">タイトル</label>
        <input
          v-model.trim="state.todoTitle"
          type="text"
          id="new-todo-title"
          form="form-todo"
        />
      </div>
      <div class="new-todo-item">
        <label for="new-todo-title">説明</label>
        <textarea
          v-model.trim="state.todoDescription"
          id="new-todo-description"
          form="form-todo"
        />
      </div>
      <div class="new-todo-category">
        カテゴリ
        <ul>
          <li v-for="category in state.categories" :key="category">
            <label :for="'category-' + category">
              <input
                v-model="state.todoCategories"
                type="checkbox"
                :id="'category-' + category"
                :value="category"
                form="form-todo"
              />
              {{ category }}
            </label>
          </li>
        </ul>
        <form @submit.prevent="createCategory">
          <input v-model.trim="categoryName" type="text" />
          <button type="submit" :disabled="!canCreateCategory">作成</button>
        </form>
      </div>
      <div class="new-todo-action">
        <form id="form-todo" @submit.prevent="createCategory">
          <button type="submit" :disabled="!canCreateTodo">作成</button>
        </form>
      </div>
    </div>
    <div>
      <div class="todo-search">
        <div class="todo-search-item">
          <label for="todo-search-category">カテゴリでフィルタ</label>
          <select v-model="state.selectCategory" id="todo-search-category">
            <option value="">指定なし</option>
            <option
              v-for="category in state.categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>
        <div class="todo-search-item">
          <label for="todo-search-done"
            >終了したものを非表示にする
            <input
              type="checkbox"
              v-model="state.hideDoneTodo"
              id="todo-search-done"
            />
          </label>
        </div>
        <div class="todo-search-item">
          <select v-model="state.order">
            <option value="desc">降順</option>
            <option value="asc">昇順</option>
          </select>
        </div>
        <div class="todo-search-item">
          <label for="todo-search-keyword">キーワードで検索</label>
          <input
            v-model.trim="state.searchWord"
            type="text"
            id="todo-search-keyword"
          />
        </div>
      </div>
      <ul v-if="hasTodos" class="todo-list">
        <li v-for="todo in resultTodos" :key="todo.id" class="toso-item">
          <div class="todo-item-done">
            <input v-model="todo.done" type="checkbox" />
          </div>
          <div class="todo-item-content">
            <div class="todo-item-date">
              {{ new Date(todo.dateTime).toString() }}
            </div>
            <h3 class="todo-item-title">{{ todo.title }}</h3>
            <div v-if="todo.description" class="todo-item-description">
              {{ todo.description }}
            </div>
            <ul class="todo-item-categories" v-if="todo.categories.length > 0">
              <li
                v-for="category in todo.categories"
                :key="category"
                class="todo-item-category"
              >
                {{ category }}
              </li>
            </ul>
          </div>
        </li>
        <!-- ここにTodoタスクの一覧が出力されます -->
      </ul>
      <p v-else>ToDoタスクはまだ登録されていません</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from "vue";

// export interface ToDoAppModel {
//   todoTitle: String;
//   todoDescription: String;
//   searchWord: String;
//   todoCategories: CategoryModel[];
//   selectCategory: String;
//   hideDoneTodo: Boolean;
//   order: "desc" | "asc";
//   categoryName: String;
//   todos: ToDoModel[];
//   categories: CategoryModel[];
// }

// export interface ToDoModel {
//   id: String;
//   title: String;
//   description: String;
//   categories: CategoryModel[];
//   dateTime: Number;
//   done: Boolean;
// }

// export interface CategoryModel {
//   id: String;
//   category: String;
// }

export default defineComponent({
  name: "ToDo",
  setup() {
    const state = reactive({
      todoTitle: "",
      todoDescription: "",
      searchWord: "",
      todoCategories: [],
      selectCategory: "",
      hideDoneTodo: false,
      order: "desc",
      categoryName: "",
      todos: [],
      categories: [],
    });

    const canCreateTodo = computed(() => {
      return state.todoTitle !== "";
    });

    const canCreateCategory = computed(() => {
      return state.categoryName !== "" && !existsCategory.value;
    });

    const existsCategory = computed(() => {
      const categoryName = state.categoryName;
      return state.categories.indexOf(categoryName) !== -1;
    });

    const hasTodos = computed(() => state.todos.length > 0);

    const resultTodos = computed(() => {
      const selectedCategory = state.selectCategory;
      const hideDoneTodo = state.hideDoneTodo;
      const order = state.order;
      const searchWord = state.searchWord;

      return state.todos
        .filter((todo) => {
          return (
            selectedCategory === "" ||
            todo.categories.indexOf(selectedCategory) !== -1
          );
        })
        .filter((todo) => {
          if (hideDoneTodo) return !todo.done;
          return true;
        })
        .filter((todo) => {
          return (
            todo.title.indexOf(searchWord) !== -1 ||
            todo.description.indexOf(searchWord) !== -1
          );
        })
        .sort((a, b) => {
          if (order === "asc") return a.dateTime - b.dateTime;
          return b.dateTime - a.dateTime;
        });
    });

    const createTodo = () => {
      if (!canCreateTodo.value) return;

      state.todos.push({
        id: "todo-" + Date.now(),
        title: state.todoTitle,
        description: state.todoDescription,
        categories: state.todoCategories,
        dateTime: Date.now(),
        done: false,
      });

      state.todoTitle = "";
      state.todoDescription = "";
      state.todoCategories = [];
    };

    const createCategory = () => {
      if (!canCreateCategory.value) return;
      state.categories.push(state.categoryName);

      state.categoryName = "";
    };

    const created = () => {
      const todos = window.localStorage.getItem("todos");
      const categories = window.localStorage.getItem("categories");

      if (todos) state.todos = JSON.parse(todos);
      if (categories) state.categories = JSON.parse(categories);
    };

    watch(
      state.todos,
      (next) => {
        window.localStorage.setItem("todos", JSON.stringify(next));
      },
      { deep: true }
    );

    watch(
      state.categories,
      (next) => {
        window.localStorage.setItem("categories", JSON.stringify(next));
      },
      { deep: true }
    );

    return {
      state,
      canCreateTodo,
      canCreateCategory,
      createCategory,
      createTodo,
      existsCategory,
      created,
      hasTodos,
      resultTodos,
    };
  },
});
</script>
<style>
.todo-list-enter {
  opacity: 0;
  transform: translateX(-20px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.todo-list-enter-to,
.todo-list-leave {
  opacity: 1;
  transform: translateX(0);
}

.todo-item {
  transition: opacity 300ms ease, transform 300ms ease;
}

/* 以下は見栄えを整えるためのスタイル */
.new-todo {
  border: 1px solid #ccc;
  padding: 30px;
}

.new-todo-item + .new-todo-item {
  margin-top: 15px;
}

.new-todo-item {
  display: flex;
}

.new-todo-item > label {
  flex-basis: 5em;
}

.new-todo-item > input[type="text"],
.new-todo-item > textarea {
  flex-grow: 1;
  font-size: inherit;
  border: 1px solid #ccc;
  padding: 0.5em;
}

.new-todo-category {
  margin-top: 20px;
  background-color: #f0f0f0;
  padding: 20px;
}

.new-todo-action {
  margin-top: 20px;
}

.new-todo-action > form {
  text-align: center;
}

.todo-search {
  display: flex;
  margin-top: 20px;
}

.todo-search-item + .todo-search-item {
  border-left: 1px solid #ccc;
  margin-left: 20px;
  padding-left: 20px;
}

.todo-list {
  border: 1px solid #ccc;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 20px;
}

.todo-item + .todo-item {
  border-top: 1px solid #ccc;
}

.todo-item-content {
  flex-grow: 1;
  margin-left: 15px;
}

.todo-item-date {
  font-size: 0.9em;
}

.todo-item-title {
  margin: 0.3em 0;
}

.todo-item-description {
  background-color: #f0f0f0;
  padding: 1em;
}

.todo-item-categories {
  margin-top: 10px;
}
</style>
