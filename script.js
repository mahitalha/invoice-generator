// Calculate item total
function calculateItemTotal(row) {
  const quantity = parseInt(row.querySelector('.item-quantity').value);
  const price = parseFloat(row.querySelector('.item-price').value);
  const total = quantity * price;
  
  return isNaN(total) ? 0 : total;
}

// Update subtotal
function updateSubtotal() {
  const items = document.getElementsByClassName('item-row');
  let subtotal = 0;
  
  for (let i = 0; i < items.length; i++) {
    subtotal += calculateItemTotal(items[i]);
  }
  
  document.getElementById('subtotal').value = subtotal.toFixed(2);
}

// Update total amount
function updateTotalAmount() {
  const subtotal = parseFloat(document.getElementById('subtotal').value);
  const discount = parseFloat(document.getElementById('discount').value);
  const tax = parseFloat(document.getElementById('tax').value);
  
  const totalAmount = (subtotal - (subtotal * (discount / 100))) * (1 + (tax / 100));
  
  document.getElementById('total-amount').value = totalAmount.toFixed(2);
}

// Update item total and total amount
function updateItemAndTotalAmount(row) {
  const itemTotal = calculateItemTotal(row);
  row.querySelector('.item-total').textContent = itemTotal.toFixed(2);
  
  updateSubtotal();
  updateTotalAmount();
}

// Generate the invoice preview
function generateInvoicePreview(e) {
  e.preventDefault();
  
  const invoiceDate = document.getElementById('invoice-date').value;
  const invoiceNumber = document.getElementById('invoice-number').value;
  const dueDate = document.getElementById('due-date').value;
  const billFrom = document.getElementById('bill-from').value;
  const billTo = document.getElementById('bill-to').value;
  
  const items = document.getElementsByClassName('item-row');
  
  let invoiceHTML = `
    <h2>Invoice</h2>
    <div class="invoice-info">
      <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
      <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
      <p><strong>Due Date:</strong> ${dueDate}</p>
    </div>
    <div class="invoice-info">
      <h3>Bill From:</h3>
      <p>${billFrom}</p>
    </div>
    <div class="invoice-info">
      <h3>Bill To:</h3>
      <p>${billTo}</p>
    </div>
    <h2>Items</h2>
    <table id="invoice-items-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  for (let i = 0; i < items.length; i++) {
    const itemName = items[i].querySelector('.item-name').value;
    const quantity = parseInt(items[i].querySelector('.item-quantity').value);
    const price = parseFloat(items[i].querySelector('.item-price').value);
    const itemTotal = calculateItemTotal(items[i]);
    
    invoiceHTML += `
      <tr>
        <td>${itemName}</td>
        <td>${quantity}</td>
        <td>${price.toFixed(2)}</td>
        <td>${itemTotal.toFixed(2)}</td>
      </tr>
    `;
  }
  
  const subtotal = parseFloat(document.getElementById('subtotal').value);
  const discount = parseFloat(document.getElementById('discount').value);
  const tax = parseFloat(document.getElementById('tax').value);
  const totalAmount = parseFloat(document.getElementById('total-amount').value);
  
  invoiceHTML += `
      </tbody>
    </table>
    <div class="invoice-summary">
      <h3>Summary</h3>
      <div>
        <label>Subtotal:</label>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div>
        <label>Discount (${discount}%):</label>
        <span>${(subtotal * (discount / 100)).toFixed(2)}</span>
      </div>
      <div>
        <label>Tax (${tax}%):</label>
        <span>${((subtotal - (subtotal * (discount / 100))) * (tax / 100)).toFixed(2)}</span>
      </div>
      <div>
        <label>Total Amount:</label>
        <span>${totalAmount.toFixed(2)}</span>
      </div>
    </div>
  `;
  
  document.getElementById('invoice-preview').innerHTML = invoiceHTML;
  document.getElementById('invoice-preview').style.display = 'block';
}

// Add item row
function addItemRow() {
  const itemsTable = document.getElementById('items-table');
  
  const row = document.createElement('tr');
  row.classList.add('item-row');
  
  const itemNameCell = document.createElement('td');
  const itemNameInput = document.createElement('input');
  itemNameInput.type = 'text';
  itemNameInput.classList.add('item-name');
  itemNameInput.placeholder = 'Item Name';
  itemNameInput.required = true;
  itemNameInput.addEventListener('input', function() {
    updateItemAndTotalAmount(row);
  });
  itemNameCell.appendChild(itemNameInput);
  
  const itemQuantityCell = document.createElement('td');
  const itemQuantityInput = document.createElement('input');
  itemQuantityInput.type = 'number';
  itemQuantityInput.classList.add('item-quantity');
  itemQuantityInput.placeholder = 'Quantity';
  itemQuantityInput.required = true;
  itemQuantityInput.addEventListener('input', function() {
    updateItemAndTotalAmount(row);
  });
  itemQuantityCell.appendChild(itemQuantityInput);
  
  const itemPriceCell = document.createElement('td');
  const itemPriceInput = document.createElement('input');
  itemPriceInput.type = 'number';
  itemPriceInput.classList.add('item-price');
  itemPriceInput.placeholder = 'Price';
  itemPriceInput.required = true;
  itemPriceInput.addEventListener('input', function() {
    updateItemAndTotalAmount(row);
  });
  itemPriceCell.appendChild(itemPriceInput);
  
  const itemTotalCell = document.createElement('td');
  itemTotalCell.classList.add('item-total');
  itemTotalCell.textContent = '0';
  
  const removeButtonCell = document.createElement('td');
  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.classList.add('remove-item');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', function() {
    row.remove();
    updateSubtotal();
    updateTotalAmount();
  });
  removeButtonCell.appendChild(removeButton);
  
  row.appendChild(itemNameCell);
  row.appendChild(itemQuantityCell);
  row.appendChild(itemPriceCell);
  row.appendChild(itemTotalCell);
  row.appendChild(removeButtonCell);
  
  itemsTable.querySelector('tbody').appendChild(row);
}

// Event listener for form submission
document.getElementById('invoice-form').addEventListener('submit', generateInvoicePreview);

// Event listener for add item button
document.getElementById('add-item').addEventListener('click', addItemRow);
