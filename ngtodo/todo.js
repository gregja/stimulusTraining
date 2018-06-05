
(() => {
    const application = Stimulus.Application.start();

    application.register("todoList", class extends Stimulus.Controller {
        static get targets() {
            return ["todoText", "dataList", "remaining", "todolength"];
        }

        calc_remaining() {
            var tmp_list = this.dataListTarget.children;
            var nb_remaining = 0;
            for (let i = 0, imax = tmp_list.length; i<imax ; i++) {
                if (tmp_list[i].dataset['done'] === 'false') {
                    nb_remaining++;
                }
            } 
            this.remainingTarget.textContent = nb_remaining;            
            this.todolengthTarget.textContent = tmp_list.length; 
        }
               
        archive(evt) {
            evt.preventDefault();
            var tmp_list = this.dataListTarget.children;
            // lecture à l'envers pour gérer les suppressions d'éléments
            // sans perte d'indice (children = HTMLCollection = NodeList "live")
            for (let i = tmp_list.length - 1; i >= 0 ; i--) {
                if (tmp_list[i].dataset['done'] === 'true') {
                    let parent = tmp_list[i].parentNode;
                    parent.removeChild(tmp_list[i]);
                }
            }
            this.calc_remaining();           
        }

        addTodo(evt) {
            evt.preventDefault();
            var input = this.todoTextTarget;
            if (input && input.value !== '') {
                var li = document.createElement("li");
                li.dataset['done'] = "false";
                li.innerHTML = this.getLiTemplate(input.value);
                this.dataListTarget.appendChild(li);
                this.todoTextTarget.value = "";
                this.calc_remaining();
            }
        }

        getLiTemplate(value, done="false") {
            var checked = '';
            if (done === 'true') {
                checked = 'checked';
            }
            return `<label class="checkbox">
                  <input type="checkbox" 
                      data-action="todoList#execToggleCheck" ${checked}>
                  <span>${value}</span>
                </label>`;
        }

        execToggleCheck(evt) {
            let nb_done = parseInt(this.remainingTarget.textContent);
            let parent = evt.target.parentNode.parentNode;
            if (parent.dataset['done'] === 'false') {
                parent.dataset['done'] = 'true';
                nb_done--;
            } else {
                parent.dataset['done'] = 'false';
                nb_done++;
            }
            this.remainingTarget.textContent = nb_done;
        }

        addDynamicsOnLiItems() {
            var tmp_list = this.dataListTarget.children;
            for (let i = 0, imax = tmp_list.length; i<imax ; i++) {
                let item = tmp_list[i];
                let done = item.dataset['done'];
                item.innerHTML = this.getLiTemplate(item.innerHTML, done);
            }             
        }
        
        connect() {
            this.addDynamicsOnLiItems();
            this.todoTextTarget.focus();
            this.calc_remaining();
        }

    })
})()
