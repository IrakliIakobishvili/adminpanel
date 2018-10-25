const Students = {
    studentsList     : document.getElementById("students__list"),
    registerBtn      : document.getElementById("registerBtn"),
    score            : document.getElementById("register_score"),
    addBtn           : document.getElementById("addBtn"),
    registration     : document.getElementById("registration"),
    studentsSection  : document.getElementById("studentsSection"),
    studentsTable    : document.getElementById("studentsTable"),

    firstNameInfo    : document.getElementById("firstname"),
    lastNameInfo     : document.getElementById("lastname"),
    ageInfo          : document.getElementById("age"),
    genderInfo       : document.getElementById("gender"),
    phoneInfo        : document.getElementById("phone"),
    addressInfo      : document.getElementById("address"),
    infoContent      : document.getElementById("info__content"),
    totalScoreOutput : document.getElementById("totalScoreOutput"),
    gradeOutput      : document.getElementById("gradeOutput"),
    editBtn          : document.getElementById("editBtn"),
    register__list   : document.getElementById("register__list"),
    scores_container : document.getElementById("scores_container"),
    clearBtn         : document.getElementById("clearBtn"),
    scoresContItem   : document.getElementById("scoresContItem"),

    baseName         : "personsBase",
    serialize: function(obj) {
        return JSON.stringify(obj);
    },
    deserialize: function(obj) {
        return JSON.parse(obj);
    },
    createBase: function() {
        if (localStorage.getItem(this.baseName) === null) {
            let persons = [];
            localStorage.setItem(Students.baseName,this.serialize(persons));
            // this.loadOrNotPersons = false; //Not run function (loadPersons) which loads already created persons from localstorage
        }        
    },
    formValidation: function(parent) {
        let filled = true;
        let inputsCount = parent.getElementsByTagName("input").length;
        for(let i = 0; i < inputsCount-1; i++) {
            if(parent.getElementsByTagName("input")[i].value.trim() === "") {
                parent.getElementsByTagName("input")[i].classList.add("redBorder");
                filled = false;
            }else {
                parent.getElementsByTagName("input")[i].classList.remove("redBorder"); 
            }
        }
        return filled;
    },
    Person: function (id,firstname, lastname, age, gender, phone, address, scores) {
        this.id = id;
        this.firstName = firstname;
        this.lastName = lastname;
        this.age = age;
        this.gender = gender;
        this.phone = phone;
        this.address = address;
        this.scores = scores;
    },
    createPerson: function() {
        let getpersonsBase   = this.deserialize(localStorage.getItem(this.baseName));
        let id               = getpersonsBase.length + 1;
        let firstname        = document.getElementById("register_firstname").value;
        let lastname         = document.getElementById("register_lastname").value;
        let age              = document.getElementById("register_age").value;
        let gender           = document.getElementById("register_gender").value;
        let phone            = document.getElementById("register_phone").value;
        let address          = document.getElementById("register_address").value;
        let scores           = this.scoresTempArray;
        
        let student          = new this.Person(id,firstname, lastname, age, gender, phone, address,scores);
        getpersonsBase.push(student);
        localStorage.setItem(this.baseName,this.serialize(getpersonsBase));

        Students.scoresTempArray = [];
        Students.totalScoreOutput.innerHTML = "";
        Students.gradeOutput.innerHTML = "";
    },
    scoresTempArray : [],
    collectScores: function() {
        let scoreInput     = document.getElementById("register_score");
        if(!isNaN(scoreInput.value) && scoreInput.value.trim() !== ""){
            scoreInput.classList.remove("redBorder");

            let scoresContainer  = document.getElementById("scores_container");
            let scoreSpan        = document.createElement("span");
            let scoreSpanTxt     = document.createTextNode(scoreInput.value);
            let $date            = new Date().toISOString().split('T')[0];
            scoreSpan.appendChild(scoreSpanTxt);
            scoresContainer.insertBefore(scoreSpan,scoresContainer.childNodes[1]);
            this.scoresTempArray.push(scoreInput.value+"&"+$date);
        }else {
            scoreInput.classList.add("redBorder");
        }          
    },
    showPerson: function() {
        let personsCount = this.deserialize(localStorage.getItem(this.baseName)).length - 1;
        let lastPerson = this.deserialize(localStorage.getItem(this.baseName))[personsCount];

        let removeIcon = document.createElement("span");
        removeIcon.classList.add("removeIcon");
        removeIcon.setAttribute("id","index_"+personsCount);
        removeIcon.addEventListener("click",function(e){
            e.stopImmediatePropagation();
            let removeIndex = this.getAttribute("id").substring(6); // removes first 6 char from 'index_54' for example and returns '54';
            let getpersonsBase = Students.deserialize(localStorage.getItem(Students.baseName));
            delete getpersonsBase[removeIndex];
            localStorage.setItem(Students.baseName,Students.serialize(getpersonsBase));
            this.parentNode.parentNode.removeChild(this.parentNode);
            if((Number(removeIndex) + 1) === Number(Students.infoContent.getAttribute("data"))) {
                let $length = Students.infoContent.getElementsByTagName("input").length;
                Students.totalScoreOutput.innerHTML = "";
                Students.gradeOutput.innerHTML = "";
                while($length--) {
                    Students.infoContent.getElementsByTagName("input")[$length].value = "";
                }
            }
        });
        /////////////////////////////////////////////////////////////////
        let item = document.createElement("li");
        item.classList.add("students__list__item");
        item.setAttribute("id","$"+lastPerson.id);
        item.innerHTML = lastPerson.firstName +" "+lastPerson.lastName;

        item.appendChild(removeIcon);
        this.studentsList.insertBefore(item, this.studentsList.childNodes[0]);
        item.addEventListener("click",function(){
            Students.showDetails(this);
        });
        ////////////////////////////////////////////////////////////////
        Students.addActiveListClass();
    },
    loadPersons: function() {
        let getpersonsBase       = this.deserialize(localStorage.getItem(this.baseName));
        let getpersonsBaseLength = getpersonsBase.length;

        if(localStorage.hasOwnProperty(this.baseName)) {
            if(getpersonsBaseLength > 0) {
                while(getpersonsBaseLength--) {
                    if(getpersonsBase[getpersonsBaseLength] !== null) {//if array is empty on that index just jump on the second index
                        let currentPerson = getpersonsBase[getpersonsBaseLength];
                        let item = document.createElement("li");
                        item.classList.add("students__list__item");
                        item.setAttribute("id","$"+currentPerson.id);
                        item.innerHTML = currentPerson.firstName +" "+currentPerson.lastName;

                        let removeIcon = document.createElement("span");
                        removeIcon.classList.add("removeIcon");
                        removeIcon.setAttribute("id","index_"+getpersonsBaseLength);
                        removeIcon.addEventListener("click",function(e){
                            e.stopImmediatePropagation();
                            let removeIndex = this.getAttribute("id").substring(6); // removes first 6 char from 'index_54' for example and returns '54';
                            let getpersonsBase = Students.deserialize(localStorage.getItem(Students.baseName));
                        
                            delete getpersonsBase[removeIndex];
                            localStorage.setItem(Students.baseName,Students.serialize(getpersonsBase));
                            this.parentNode.parentNode.removeChild(this.parentNode);
                            if(currentPerson.id === Number(Students.infoContent.getAttribute("data"))) {
                                let $length = Students.infoContent.getElementsByTagName("input").length;
                                Students.totalScoreOutput.innerHTML = "";
                                Students.gradeOutput.innerHTML = "";
                                while($length--) {
                                    Students.infoContent.getElementsByTagName("input")[$length].value = "";
                                }
                            }
                        });

                        item.appendChild(removeIcon);
                        this.studentsList.appendChild(item);
                    }              
                }
            }
        }       
    },
    showDetails: function($this) {
        let index                = $this.getAttribute("id").substring(1)-1; //ID's counting starts from 1 insted of 0; substract 1 to equal index;
        let getpersonsBase       = this.deserialize(localStorage.getItem(this.baseName));
        let currentPerson        = getpersonsBase[index];

        this.firstNameInfo.value = currentPerson.firstName;
        this.lastNameInfo.value  = currentPerson.lastName;
        this.ageInfo.value       = currentPerson.age;
        this.genderInfo.value    = currentPerson.gender;
        this.phoneInfo.value     = currentPerson.phone;
        this.addressInfo.value   = currentPerson.address;

        //if person which is removing is shown currently into info section we must clear inputs, so if items ID is equal Sections Data attribute inputs will be cleared!
        this.infoContent.setAttribute("data",currentPerson.id);

        let scoresInfoSection    = document.getElementById("scores_info_section");
        while (scoresInfoSection.firstChild) {
            scoresInfoSection.firstChild.remove();
        }

        let scoresLength      = currentPerson.scores.length;
        let totalScore        = 0;
        let totalScoreOutput  = document.getElementById("totalScoreOutput");
        let gradeOutput       = document.getElementById("gradeOutput");
        let grade             = "";
        while(scoresLength--) {
            let scoreNum  = currentPerson.scores[scoresLength].split("&")[0];
            let scoreDate = currentPerson.scores[scoresLength].split("&")[1];

            totalScore += Number(scoreNum);

            let scoreBox             = document.createElement("div");
            let scoreBoxInputDate    = document.createElement("input");
            let scoreBoxInputScore   = document.createElement("input");

            scoreBox.classList.add("score_box");
            scoreBoxInputDate.classList.add("score_box__input__date");
            scoreBoxInputScore.classList.add("score_box__input__score");

            scoreBoxInputScore.value = scoreNum;
            scoreBoxInputDate.value  = scoreDate;

            scoreBox.appendChild(scoreBoxInputDate);
            scoreBox.appendChild(scoreBoxInputScore);
            scoresInfoSection.insertBefore(scoreBox,scoresInfoSection.childNodes[0]);
            totalScoreOutput.innerHTML = totalScore;
            if(totalScore <= 60) {
                grade = "C";
            }else if (totalScore < 100) {
                grade = "B";
            }else if(totalScore >= 100) {
                grade = "A";
            }
            gradeOutput.innerHTML = grade;
        }
        Students.disableInputs(Students.infoContent);
    },
    showDetailsOnLoad: function() {
        let getpersonsBase   = this.deserialize(localStorage.getItem(this.baseName));
        let list = document.getElementById("students__list").getElementsByTagName("li");
        let listLength = list.length;
        if(listLength) {
            while(listLength--) {
                list[listLength].addEventListener("click",function(){
                    Students.showDetails(this);
                });
            }
        }
    },
    editInfo: function() {
        let $id = Students.infoContent.getAttribute("data");
        let getpersonsBase   = this.deserialize(localStorage.getItem(this.baseName));
        let id               = $id;
        let firstname        = document.getElementById("firstname").value;
        let lastname         = document.getElementById("lastname").value;
        let age              = document.getElementById("age").value;
        let gender           = document.getElementById("gender").value;
        let phone            = document.getElementById("phone").value;
        let address          = document.getElementById("address").value;
        let scoresSection    = document.getElementById("scores_info_section");
        let scoreBox         = scoresSection.getElementsByTagName("div");
        let scoreBoxCount    = scoreBox.length;
        let scoreDate        = scoreBox.firstChild;
        let totalScore       = 0;
        let totalScoreOutput = document.getElementById("totalScoreOutput");
        let gradeOutput      = document.getElementById("gradeOutput");

        for(let i = 0; i < scoreBoxCount; i++) {
            totalScore += Number(scoreBox[i].lastChild.value);
            Students.scoresTempArray.push(scoreBox[i].lastChild.value+"&"+scoreBox[i].firstChild.value);
        }
        
        let scores            = Students.scoresTempArray;
        let student           = new this.Person(id,firstname, lastname, age, gender, phone, address,scores);
        getpersonsBase[$id-1] = student;
        localStorage.setItem(Students.baseName,Students.serialize(getpersonsBase));
        
        Students.scoresTempArray = [];
        totalScoreOutput.innerHTML = totalScore;

        if(totalScore <= 60) {
            grade = "C";
        }else if (totalScore < 100) {
            grade = "B";
        }else if(totalScore >= 100) {
            grade = "A";
        }

        document.getElementById("$"+$id).innerHTML = firstname +" "+lastname;

        let removeIcon = document.createElement("span");
        removeIcon.classList.add("removeIcon");
        removeIcon.setAttribute("id","index_"+Number($id-1));
        console.log("index_"+Number($id-1))
        removeIcon.addEventListener("click",function(e){
            e.stopImmediatePropagation();
            let removeIndex = this.getAttribute("id").substring(6); // removes first 6 char from 'index_54' for example and returns '54';
            let getpersonsBase = Students.deserialize(localStorage.getItem(Students.baseName));
            delete getpersonsBase[removeIndex];
            localStorage.setItem(Students.baseName,Students.serialize(getpersonsBase));
            this.parentNode.parentNode.removeChild(this.parentNode);
            if((Number(removeIndex) + 1) === Number(Students.infoContent.getAttribute("data"))) {
                let $length = Students.infoContent.getElementsByTagName("input").length;
                Students.totalScoreOutput.innerHTML = "";
                Students.gradeOutput.innerHTML = "";
                while($length--) {
                    Students.infoContent.getElementsByTagName("input")[$length].value = "";
                }
            }
        });
        document.getElementById("$"+$id).appendChild(removeIcon);

        gradeOutput.innerHTML = grade;
        Students.disableInputs(Students.infoContent)
    },
    disableInputs: function(parent) {
        Students.editBtn.innerHTML = "Edit";
        let inputArr = parent.getElementsByTagName("input");
        let $length  = parent.getElementsByTagName("input").length;
        while($length--) {
            inputArr[$length].disabled = true;
        }
    },
    enableInputs: function(parent) {
        if(Students.infoContent.getAttribute("data")) {
            Students.editBtn.innerHTML = "Save";
            let inputArr = parent.getElementsByTagName("input");
            let $length  = parent.getElementsByTagName("input").length;
            while($length--) {
                inputArr[$length].disabled = false;
            }
        }
    },
    addActiveListClass: function($this) {
        let items        = Students.studentsList.getElementsByTagName("li");
        let itemsLength  = items.length;
        if(itemsLength) {
            while(itemsLength--) {
                items[itemsLength].addEventListener("click",function(){
                    Students.removeActiveListClass();
                    this.classList.add("activeList");
                });
            }
        }
    },
    removeActiveListClass: function() {
        let items        = Students.studentsList.getElementsByTagName("li");
        let itemsLength  = items.length;
        if(itemsLength) {
            while(itemsLength--) {
                items[itemsLength].classList.remove("activeList");
            }
        }
    },
    clearInputs: function(parent) {
        let inputs       = parent.getElementsByTagName("input");
        let inputsLength = inputs.length;
        while(inputsLength--) {
            inputs[inputsLength].value = "";
        }
    },
    removeElements: function(parent,el) {
        let els       = parent.getElementsByTagName(el);
        let elsLength = els.length;
        while(elsLength) {
            parent.removeChild(parent.childNodes[elsLength])
            elsLength--;
        }
    },
    clearBase: function() {
        localStorage.clear();
        let items       = Students.studentsList.getElementsByTagName("li");
        let itemsLength = items.length;
        while(itemsLength--) {
            items[itemsLength].parentNode.removeChild(items[itemsLength])
        }
    }
}//Students
Students.createBase();
Students.loadPersons();
Students.showDetailsOnLoad();

Students.addActiveListClass();

Students.registerBtn.addEventListener("click",function(){
    if(Students.formValidation(Students.registration)) {
        Students.createPerson();
        Students.showPerson();
        Students.clearInputs(Students.register__list);
        Students.removeElements(Students.scores_container,"span");
    }
});

Students.addBtn.addEventListener("click",function(){
    Students.collectScores();
    Students.clearInputs(Students.scoresContItem);
});

Students.editBtn.addEventListener("click",function(){
    (this.innerHTML === "Edit") ? Students.enableInputs(Students.infoContent) : Students.editInfo();
});

Students.clearBtn.addEventListener("click",function(){
    Students.clearBase();
});