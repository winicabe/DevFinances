const Modal = {
    open() {
        document.querySelector(".modal-overlay").classList.add("active")
    },
    close() {
        document.querySelector(".modal-overlay").classList.remove("active")
    }
}
const Transactions= [{
    id:1,
    description:"Luz",
    amount:-50000,
    date:"25/12/2021"
},{
    id:2,
    description:"Criação de Site",
    amount:500000,
    date:"25/12/2021"
},{
    id:3,
    description:"Comida",
    amount:-70000,
    date:"25/12/2021"
}]
const Transaction = {
    all: Transactions,
    add(transaction){
        Transaction.all.push(transaction);
        App.reload()
    },
    income(){
        let income = 0;
        Transaction.all.forEach(transiction => {
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
        return INCOME - EXPENSE;
    }
}
const DOM = {
    transactionsContainer:document.querySelector("#data-table tbody"),
    addTransation(transactions, index){
        const tr = document.createElement("tr");
        tr.innerHTML = DOM.innerHtmlTransictions(transactions)
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHtmlTransictions(transactions){
        const CSSclass = transactions.amount > 0 ? "income" : "expense";
        const amount = Operations.formatCurency(transactions.amount);
        const html = `
        <td class="description">${transactions.description}</td>
        <td class=${CSSclass}>${amount}</td>
        <td class="date">${transactions.date}</td>
        <td><img src="./assets/images/minus.svg" alt=""></td>
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
}
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
    validateFields(){
        const {description, amount, date} = Form.getValues()
        if(description === "" || amount === "" || date === ""){
            throw new Error("Por favor, Preencha todos os campos!");
        }
    }
    submitErro(){
        
    }
}
const Operations = {
    formatCurency(value){
        const singal = Number(value) < 0 ? "-": "";

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style:"currency",
            currency:"BRL"
        });
        return singal + value;
    }
}
const App = {
    init(){
        Transactions.forEach(function(transaction){
            DOM.addTransation(transaction)
        })
        console.log("2")
        DOM.updateBalance()
    },
    reload(){
        DOM.clearTransacions()
        this.init()
    }
}
App.init()
