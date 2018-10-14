new Vue({
    el: '#app',
    data() {
        return {
            todoList: [
                { "id": 0, "title": "Upload TODO app to GiHub", "done": false },
            ],
            newTodo: '',
            colors: ["#9b59b6", "#3498db", "#2ecc71", "#f1c40f", "#e67e22", "#e74c3c"],
            liIndex: null, // this variable is to fire the animation to the selected li
            showCompleted: false
        }
    },
    computed: {
        today: function () {

            var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saterday'];
            var today = new Date();

            var dd = today.getDate();
            var mm = today.getMonth() + 1; //january = 0 ..!
            var yyyy = today.getFullYear();

            var day = weekDays[today.getDay()];

            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            }

            today = {
                day: day,
                date: dd + '-' + mm + '-' + yyyy
            }

            return today;
        },
        pending: function () {
            return this.todoList.filter(function (item) {
                return !item.done; // return TODOs that have done: false
            })
        },
        completed: function () {
            return this.todoList.filter(function (item) {
                return item.done;
            })
        }
    },
    methods: {
        completedTodo: function (sentID) {
            this.todoList.forEach(function (todo) {
                if (todo.id == sentID) {
                    todo.done = true;
                }
            });
            localStorage.setItem('todo_list', JSON.stringify(this.todoList));
        },
        rePendTodo: function (sentID) {
            this.todoList.forEach(function (todo) {
                if (todo.id == sentID) {
                    todo.done = false;
                }
            });
            localStorage.setItem('todo_list', JSON.stringify(this.todoList));
        },
        splitUp: function () { // For the label animation

            const textLabel = document.querySelector('#text-label');
            textLabel.classList.add('active');
        },
        splitDown: function () { // For the label animation

            if (!this.newTodo) { // if newTodo is empity
                const textLabel = document.querySelector('#text-label');
                textLabel.classList.remove('active');
            }
        },
        getTODOs: function () {

            if (localStorage.getItem('todo_list')) {
                this.todoList = JSON.parse(localStorage.getItem('todo_list'));
                // get the stored data, then parse them from String into JSON
            }

        },
        addTODOs: function () {
            if (this.newTodo) { //if not empity
                this.todoList.unshift({
                    id: this.todoList.length,
                    title: this.newTodo,
                    done: false
                });
            }

            // clear the text box
            this.newTodo = '';

            this.$emit('todoList', JSON.stringify(this.todoList));

            // animation: close the label
            this.splitDown();

            return true;
        },
        deleteTODOs: function (item) {
            this.todoList.splice(this.todoList.indexOf(item), 1);
            localStorage.setItem('todo_list', JSON.stringify(this.todoList));
            // I delete the selected index from the array, then reset the localStorage again
            // Because it accept string values, so I can't delete particualr index

            if (this.completed.length == '0') {
                this.showCompleted = flase;
            }
        },
        clear: function () {
            this.todoList = [];
        }
    },
    watch: {
        todoList: {
            handler: function (updatedList) {
                localStorage.setItem('todo_list', JSON.stringify(updatedList));
                // set the localStorage, By the way it accept only String
            }
        }
    },
    created() {
        this.getTODOs();
        this.$emit('todoList', JSON.stringify(this.todoList));
    },
    directives: {
        'custom-color': {
            bind(el, binding) {
                // I pass the array of colors as a parameter in the directive
                el.style.borderTop = '2px solid ' + binding.value[Math.floor(Math.random() * 6)];
            }
        }
    }
});