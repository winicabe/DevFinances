const Modal = {
    open() {
        document.querySelector(".modal-overlay").classList.add("active")
    },
    close() {
        document.querySelector(".modal-overlay").classList.remove("active")
    }
};
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transaction){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transaction))
    }
}
const Transaction = {
    all: Storage.get(),
    add(transaction){
        Transaction.all.push(transaction);
        App.reload()
    },
    remove(index){
        this.all.splice(index, 1);
        App.reload()
    },
    income(){
        let income = 0;
        Transaction.all.forEach(transiction => {
            transiction.amount = Number(transiction.amount)
            if(transiction.amount > 0){
                income += transiction.amount;
            }
        })
        return income
    },
    expenses(){
        let expenses = 0;
        Transaction.all.forEach(transiction => {
            if (transiction.amount < 0){
                expenses += transiction.amount;
            }
        })
        return expenses;

    },
    total(){
        const INCOME = this.income();
        const EXPENSE =  this.expenses();
        return INCOME + EXPENSE;
    }
};
const DOM = {
    transactionsContainer:document.querySelector("#data-table tbody"),
    addTransation(transactions, index){
        const tr = document.createElement("tr");
        tr.dataset.index = index
        tr.innerHTML = DOM.innerHtmlTransictions(transactions, index)
        
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHtmlTransictions(transactions, index){
        const CSSclass = transactions.amount > 0 ? "income" : "expense";
        const amount = Operations.formatCurency(transactions.amount);
        const html = `
        <td class="description">${transactions.description}</td>
        <td class=${CSSclass}>${amount}</td>
        <td class="date">${transactions.date}</td>
        <td><img onclick="Transaction.remove(${index})" src="./assets/images/minus.svg" alt=""></td>
        `
        return html
    },
    updateBalance(){
        document.getElementById("expenseDisplay").innerHTML = Operations.formatCurency(Transaction.income())
        document.getElementById("incomeDisplay").innerHTML = Operations.formatCurency(Transaction.expenses())
        document.getElementById("totalDisplay").innerHTML = Operations.formatCurency(Transaction.total())
    },
    clearTransacions(){
        this.transactionsContainer.innerHTML=""
    }
};
const Form = {
    description:document.getElementById("description"),
    amount:document.getElementById("amount"),
    date:document.getElementById("date"),
    getValues(){
        return{
        description:Form.description.value,
        amount:Form.amount.value,
        date:Form.date.value
        }
    },
    formatValues(){
        let {description, amount, date} = Form.getValues();
        amount = Operations.fromatAmount(amount);
        date = Operations.formatDate(date);
        return {description, amount, date};
    },
    validateFields(){
        const {description, amount, date} = Form.getValues()
        if(description === "" || amount === "" || date === ""){
            throw new Error("Por favor, Preencha todos os campos!");
        }
    },
    clearFields(){
        this.description = "";
        this.amount = "";
        this.date = "";
    },
    submit(event){
        event.preventDefault()
        try {
            this.validateFields();
            const transaction = this.formatValues()
            Transaction.add(transaction)
            this.clearFields()
            Modal.close()

        }catch (error){
            alert(error.message);
        }
    }
};
const Operations = {
    fromatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * 100
        return value
    },
    formatCurency(value){
        const singal = Number(value) < 0 ? "-": "";

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style:"currency",
            currency:"BRL"
        });
        return singal + value;
    },
    formatDate(date){
        const FORMATDATE = date.split("-")
        console.log(FORMATDATE)
        return `${FORMATDATE[2]}/${FORMATDATE[1]}/${FORMATDATE[0]}`
    }
};
const App = {
    init(){
        Transaction.all.forEach(function(transaction, index){
            DOM.addTransation(transaction, index);
            console.log(index)
        })
        console.log("foi");
        DOM.updateBalance();
        Storage.set(Transaction.all)
    },
    reload(){
        DOM.clearTransacions();
        this.init();
    }
}
App.init()
