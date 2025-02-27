// المتغيرات
let dailyIncomes = [];
let dailyExpenses = [];
let itemsToBuy = [];
let accounts = [];
let totalIncome = 0;
let totalExpenses = 0;

// التوكن ومسار المستودع
const token = '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';
const repo = 'Mohrx1/managermony4';

// دالة لحفظ البيانات على GitHub
async function saveToGitHub(data, filename) {
    const path = `data/${filename}`;
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;
    const content = btoa(JSON.stringify(data)); // تحويل البيانات إلى base64

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: `Update ${filename}`,
            content: content,
            sha: '' // يمكنك ترك هذا فارغًا إذا كنت تنشئ ملفًا جديدًا
        })
    });

    if (response.ok) {
        console.log('تم حفظ البيانات بنجاح على GitHub');
    } else {
        console.error('فشل في حفظ البيانات على GitHub', await response.json());
    }
}

// دالة لتحميل البيانات من GitHub
async function loadFromGitHub(filename) {
    const path = `data/${filename}`;
    const url = `https://api.github.com/repos/${repo}/contents/${path}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `token ${token}`,
        }
    });

    if (response.ok) {
        const data = await response.json();
        return JSON.parse(atob(data.content)); // تحويل البيانات من base64 إلى JSON
    } else {
        console.error('فشل في تحميل البيانات من GitHub', await response.json());
        return null;
    }
}

// دالة لإضافة دخل يومي
async function addDailyIncome() {
    const amount = parseFloat(document.getElementById('dailyIncomeAmount').value);
    const notes = document.getElementById('dailyIncomeNotes').value;

    if (amount) {
        dailyIncomes.push({ amount, notes });
        totalIncome += amount;
        updateDailyIncomeList();
        updateResults();
        localStorage.setItem('dailyIncomes', JSON.stringify(dailyIncomes));
        localStorage.setItem('totalIncome', totalIncome);
        await saveToGitHub(dailyIncomes, 'dailyIncomes.json'); // حفظ البيانات على GitHub
        document.getElementById('dailyIncomeAmount').value = '';
        document.getElementById('dailyIncomeNotes').value = '';
    } else {
        showError('الرجاء إدخال المبلغ!');
    }
}

// دالة لتحديث قائمة الدخل اليومي
function updateDailyIncomeList() {
    const list = document.getElementById('dailyIncomeList');
    list.innerHTML = '';
    dailyIncomes.forEach((income, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-details">
                <span>${income.amount} ريال</span>
                <div class="notes">${income.notes}</div>
            </div>
            <div class="dropdown">
                <button class="dropdown-btn">...</button>
                <div class="dropdown-content">
                    <button onclick="removeDailyIncome(${index})">حذف</button>
                </div>
            </div>
        `;
        list.appendChild(li);
    });
    document.getElementById('totalIncome').textContent = totalIncome;
}

// دالة لحذف دخل يومي
async function removeDailyIncome(index) {
    const removedIncome = dailyIncomes.splice(index, 1)[0];
    totalIncome -= removedIncome.amount;
    updateDailyIncomeList();
    updateResults();
    localStorage.setItem('dailyIncomes', JSON.stringify(dailyIncomes));
    localStorage.setItem('totalIncome', totalIncome);
    await saveToGitHub(dailyIncomes, 'dailyIncomes.json'); // حفظ البيانات على GitHub
}

// دالة لإضافة مصروف يومي
async function addDailyExpense() {
    const amount = parseFloat(document.getElementById('dailyExpenseAmount').value);
    const notes = document.getElementById('dailyExpenseNotes').value;

    if (amount) {
        dailyExpenses.push({ amount, notes });
        totalExpenses += amount;
        updateDailyExpensesList();
        updateResults();
        localStorage.setItem('dailyExpenses', JSON.stringify(dailyExpenses));
        localStorage.setItem('totalExpenses', totalExpenses);
        await saveToGitHub(dailyExpenses, 'dailyExpenses.json'); // حفظ البيانات على GitHub
        document.getElementById('dailyExpenseAmount').value = '';
        document.getElementById('dailyExpenseNotes').value = '';
    } else {
        showError('الرجاء إدخال المبلغ!');
    }
}

// دالة لتحديث قائمة المصاريف اليومية
function updateDailyExpensesList() {
    const list = document.getElementById('dailyExpensesList');
    list.innerHTML = '';
    dailyExpenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-details">
                <span>${expense.amount} ريال</span>
                <div class="notes">${expense.notes}</div>
            </div>
            <div class="dropdown">
                <button class="dropdown-btn">...</button>
                <div class="dropdown-content">
                    <button onclick="removeDailyExpense(${index})">حذف</button>
                </div>
            </div>
        `;
        list.appendChild(li);
    });
    document.getElementById('totalExpenses').textContent = totalExpenses;
}

// دالة لحذف مصروف يومي
async function removeDailyExpense(index) {
    const removedExpense = dailyExpenses.splice(index, 1)[0];
    totalExpenses -= removedExpense.amount;
    updateDailyExpensesList();
    updateResults();
    localStorage.setItem('dailyExpenses', JSON.stringify(dailyExpenses));
    localStorage.setItem('totalExpenses', totalExpenses);
    await saveToGitHub(dailyExpenses, 'dailyExpenses.json'); // حفظ البيانات على GitHub
}

// دالة لإضافة شيء مراد شراؤه
async function addItem() {
    const name = document.getElementById('itemName').value;
    const amount = parseFloat(document.getElementById('itemAmount').value);

    if (name && amount) {
        itemsToBuy.push({ name, amount, paid: 0 });
        updateItemsList();
        localStorage.setItem('itemsToBuy', JSON.stringify(itemsToBuy));
        await saveToGitHub(itemsToBuy, 'itemsToBuy.json'); // حفظ البيانات على GitHub
        document.getElementById('itemName').value = '';
        document.getElementById('itemAmount').value = '';
    } else {
        showError('الرجاء إدخال اسم الشيء والمبلغ!');
    }
}

// دالة لتحديث قائمة الأشياء المراد شراؤها
function updateItemsList() {
    const list = document.getElementById('itemsList');
    list.innerHTML = '';
    itemsToBuy.forEach((item, index) => {
        const remaining = item.amount - item.paid;
        const progress = (item.paid / item.amount) * 100;

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-details">
                <strong>${item.name}</strong>
                <div>المطلوب: ${item.amount} ريال</div>
                <div>المدفوع: ${item.paid} ريال</div>
                <div>المتبقي: ${remaining} ريال</div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%">${progress.toFixed(2)}%</div>
                </div>
            </div>
            <div class="actions">
                ${remaining > 0 ? 
                    `<select id="accountSelect${index}">
                        <option value="net">المبلغ الصافي الكلي</option>
                        ${accounts.map((account, i) => `<option value="${i}">${account.name}</option>`).join('')}
                    </select>
                    <input type="number" id="payAmount${index}" placeholder="المبلغ المدفوع">
                    <button onclick="payForItem(${index})">دفع</button>`
                    : `<span class="completed">✔ اكتمل</span>`
                }
                <div class="dropdown">
                    <button class="dropdown-btn">...</button>
                    <div class="dropdown-content">
                        <button onclick="removeItem(${index})">حذف</button>
                    </div>
                </div>
            </div>
        `;
        list.appendChild(li);
    });
}

// دالة للدفع مقابل شيء مراد شراؤه
async function payForItem(index) {
    const amount = parseFloat(document.getElementById(`payAmount${index}`).value);
    const accountIndex = document.getElementById(`accountSelect${index}`).value;
    const remaining = itemsToBuy[index].amount - itemsToBuy[index].paid;

    // التحقق من أن المبلغ المدفوع لا يتجاوز المبلغ المطلوب
    if (amount > remaining) {
        showError('المبلغ المدفوع أكبر من المبلغ المطلوب!', `payAmount${index}`);
        return;
    }

    if (amount) {
        if (accountIndex === "net") {
            // الدفع من المبلغ الصافي الكلي
            const netAmount = totalIncome - totalExpenses;
            if (amount > netAmount) {
                showError('المبلغ غير كافي في الصافي الكلي!', `payAmount${index}`);
                return;
            }
            totalExpenses += amount; // خصم المبلغ من الصافي
        } else {
            // الدفع من الحساب المحدد
            const account = accounts[accountIndex];
            if (amount > account.balance) {
                showError('المبلغ غير كافي في الحساب المحدد!', `payAmount${index}`);
                return;
            }
            account.balance -= amount; // خصم المبلغ من الحساب
        }

        itemsToBuy[index].paid += amount;
        updateItemsList();
        updateAccountsList();
        updateResults();
        localStorage.setItem('itemsToBuy', JSON.stringify(itemsToBuy));
        localStorage.setItem('accounts', JSON.stringify(accounts));
        localStorage.setItem('totalExpenses', totalExpenses);
        await saveToGitHub(itemsToBuy, 'itemsToBuy.json'); // حفظ البيانات على GitHub
        await saveToGitHub(accounts, 'accounts.json'); // حفظ البيانات على GitHub
        document.getElementById(`payAmount${index}`).value = '';
    } else {
        showError('الرجاء إدخال المبلغ المدفوع!', `payAmount${index}`);
    }
}

// دالة لحذف شيء مراد شراؤه
async function removeItem(index) {
    const removedItem = itemsToBuy.splice(index, 1)[0];
    const remainingAmount = removedItem.amount - removedItem.paid;

    // إعادة المبلغ المتبقي إلى الصافي الكلي إذا لم يكتمل
    if (remainingAmount > 0) {
        totalExpenses -= removedItem.paid;
    }

    updateItemsList();
    updateResults();
    localStorage.setItem('itemsToBuy', JSON.stringify(itemsToBuy));
    localStorage.setItem('totalExpenses', totalExpenses);
    await saveToGitHub(itemsToBuy, 'itemsToBuy.json'); // حفظ البيانات على GitHub
}

// دالة لإضافة حساب منعزل
async function addAccount() {
    const name = document.getElementById('accountName').value;

    if (name) {
        accounts.push({ name, balance: 0 });
        updateAccountsList();
        localStorage.setItem('accounts', JSON.stringify(accounts));
        await saveToGitHub(accounts, 'accounts.json'); // حفظ البيانات على GitHub
        document.getElementById('accountName').value = '';
    } else {
        showError('الرجاء إدخال اسم الحساب!');
    }
}

// دالة لتحديث قائمة الحسابات المنعزلة
function updateAccountsList() {
    const list = document.getElementById('accountsList');
    list.innerHTML = '';
    accounts.forEach((account, index) => {
        const accountDiv = document.createElement('div');
        accountDiv.className = 'account';
        accountDiv.innerHTML = `
            <h3>${account.name}</h3>
            <p>الرصيد الحالي: ${account.balance} ريال</p>
            <div class="account-actions">
                <input type="number" id="depositAmount${index}" placeholder="المبلغ للإيداع">
                <button onclick="depositToAccount(${index})">إيداع</button>
                <input type="number" id="withdrawAmount${index}" placeholder="المبلغ للسحب">
                <button onclick="withdrawFromAccount(${index})">سحب</button>
                <div class="dropdown">
                    <button class="dropdown-btn">...</button>
                    <div class="dropdown-content">
                        <button onclick="removeAccount(${index})">حذف الحساب</button>
                    </div>
                </div>
            </div>
        `;
        list.appendChild(accountDiv);
    });
}

// دالة لإيداع مبلغ في الحساب
async function depositToAccount(index) {
    const amount = parseFloat(document.getElementById(`depositAmount${index}`).value);
    const netAmount = totalIncome - totalExpenses;

    if (amount > netAmount) {
        showError('المبلغ غير كافي في الصافي الكلي!', `depositAmount${index}`);
        return;
    }

    if (amount) {
        accounts[index].balance += amount;
        totalExpenses += amount; // خصم المبلغ من الصافي
        updateAccountsList();
        updateResults();
        localStorage.setItem('accounts', JSON.stringify(accounts));
        localStorage.setItem('totalExpenses', totalExpenses);
        await saveToGitHub(accounts, 'accounts.json'); // حفظ البيانات على GitHub
        document.getElementById(`depositAmount${index}`).value = '';
    } else {
        showError('الرجاء إدخال المبلغ!', `depositAmount${index}`);
    }
}

// دالة لسحب مبلغ من الحساب
async function withdrawFromAccount(index) {
    const amount = parseFloat(document.getElementById(`withdrawAmount${index}`).value);

    if (amount > accounts[index].balance) {
        showError('المبلغ المطلوب للسحب أكبر من الرصيد المتاح!', `withdrawAmount${index}`);
        return;
    }

    if (amount) {
        accounts[index].balance -= amount;
        totalExpenses -= amount; // إضافة المبلغ إلى الصافي
        updateAccountsList();
        updateResults();
        localStorage.setItem('accounts', JSON.stringify(accounts));
        localStorage.setItem('totalExpenses', totalExpenses);
        await saveToGitHub(accounts, 'accounts.json'); // حفظ البيانات على GitHub
        document.getElementById(`withdrawAmount${index}`).value = '';
    } else {
        showError('الرجاء إدخال المبلغ!', `withdrawAmount${index}`);
    }
}

// دالة لحذف حساب
async function removeAccount(index) {
    const removedAccount = accounts.splice(index, 1)[0];
    totalExpenses -= removedAccount.balance; // إعادة الرصيد إلى الصافي
    updateAccountsList();
    updateResults();
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.setItem('totalExpenses', totalExpenses);
    await saveToGitHub(accounts, 'accounts.json'); // حفظ البيانات على GitHub
}

// دالة لتحديث النتائج
function updateResults() {
    const netAmount = totalIncome - totalExpenses;
    document.getElementById('totalIncome').textContent = totalIncome;
    document.getElementById('totalExpenses').textContent = totalExpenses;
    document.getElementById('netAmount').textContent = netAmount;
}

// دالة لعرض الخطأ
function showError(message, elementId = null) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;

    if (elementId) {
        const element = document.getElementById(elementId);
        element.parentNode.insertBefore(errorDiv, element.nextSibling);
    } else {
        document.body.appendChild(errorDiv);
    }

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// دالة لتصفير جميع المبالغ
async function resetAll() {
    dailyIncomes = [];
    dailyExpenses = [];
    itemsToBuy = [];
    accounts = [];
    totalIncome = 0;
    totalExpenses = 0;

    localStorage.clear();
    await saveToGitHub(dailyIncomes, 'dailyIncomes.json'); // حفظ البيانات على GitHub
    await saveToGitHub(dailyExpenses, 'dailyExpenses.json'); // حفظ البيانات على GitHub
    await saveToGitHub(itemsToBuy, 'itemsToBuy.json'); // حفظ البيانات على GitHub
    await saveToGitHub(accounts, 'accounts.json'); // حفظ البيانات على GitHub
    updateDailyIncomeList();
    updateDailyExpensesList();
    updateItemsList();
    updateAccountsList();
    updateResults();
}

// استرجاع البيانات عند تحميل الصفحة
window.onload = async function () {
    dailyIncomes = await loadFromGitHub('dailyIncomes.json') || [];
    dailyExpenses = await loadFromGitHub('dailyExpenses.json') || [];
    itemsToBuy = await loadFromGitHub('itemsToBuy.json') || [];
    accounts = await loadFromGitHub('accounts.json') || [];
    totalIncome = parseFloat(localStorage.getItem('totalIncome')) || 0;
    totalExpenses = parseFloat(localStorage.getItem('totalExpenses')) || 0;

    updateDailyIncomeList();
    updateDailyExpensesList();
    updateItemsList();
    updateAccountsList();
    updateResults();
};