import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  today = new Date();
  selectedTable: number | null = null;
  customerMobile: string = '';
  customerName: string = '';
  orderType: string = 'dine';
  activeCategory: number = 1;
  cart: any[] = [];
  discount: number = 0;
  packingCharges: number = 0;
  tokenNumber: number = 0;
  billNumber: number = 1;
  noOfPax: number = 1;
  cashAmount: string = '';
  
  todaySummary = {
    totalSales: 0,
    totalOrders: 0,
    averageBill: 0,
    freeToken: 3,
    runningToken: 5,
    billedToken: 12
  };

  tables: any[] = Array.from({ length: 28 }, (_, i) => ({
    id: i + 1,
    isOccupied: false,
    customerName: undefined,
    orderAmount: 0,
    tokenNo: 0
  }));

  categories = [
    { id: 1, name: 'All', icon: '🔥' },
    { id: 2, name: 'Juices', icon: '🥤' },
    { id: 3, name: 'Desserts', icon: '🍦' },
    { id: 4, name: 'Bowls', icon: '🥗' },
    { id: 5, name: 'Snacks', icon: '🍕' }
  ];

  menuItems = [
    { id: 1, name: 'Eco Friendly Bowl', price: 120, categoryId: 4 },
    { id: 2, name: 'Sj - Brownie', price: 60, categoryId: 3 },
    { id: 3, name: 'Sj - Cherry', price: 30, categoryId: 2 },
    { id: 4, name: 'Sj - Dukes Twister', price: 30, categoryId: 2 },
    { id: 5, name: 'Sj - Hazelnut', price: 30, categoryId: 3 },
    { id: 6, name: 'Sj - Mango Pip', price: 30, categoryId: 2 },
    { id: 7, name: 'Sj - Sipper Glass', price: 10, categoryId: 2 },
    { id: 8, name: 'Sj - Muesli', price: 30, categoryId: 3 },
    { id: 9, name: 'Sj - Almond', price: 30, categoryId: 3 },
    { id: 10, name: 'Sj - Carrot Halwa', price: 30, categoryId: 3 },
    { id: 11, name: 'Sj - Choco Chips', price: 30, categoryId: 3 },
    { id: 12, name: 'Extra Chicken', price: 20, categoryId: 5 },
    { id: 13, name: 'Sj - Honey', price: 30, categoryId: 3 },
    { id: 14, name: 'Sj - Kit Kat', price: 30, categoryId: 3 },
    { id: 15, name: 'Sj - Praline', price: 30, categoryId: 3 },
    { id: 16, name: 'Sj - Tufty Fruity', price: 30, categoryId: 3 },
    { id: 17, name: 'SDK - Chia seeds Juice', price: 90, categoryId: 3 },
    { id: 18, name: 'SDK - Mint Lemon Juice', price: 80, categoryId: 3 },
{ id: 19, name: 'SDK - Watermelon Fresh Juice', price: 100, categoryId: 3 },
{ id: 20, name: 'SDK - Pineapple Ginger Juice', price: 110, categoryId: 3 },
{ id: 21, name: 'SDK - Orange Carrot Detox Juice', price: 120, categoryId: 3 }
  ];

  get filteredItems() {
    if (this.activeCategory === 1) return this.menuItems;
    return this.menuItems.filter(item => item.categoryId === this.activeCategory);
  }

  get subtotal() {
    return this.cart.reduce((sum, item) => sum + item.total, 0);
  }

  get totalTax() {
    return +(this.subtotal * 0.05).toFixed(2);
  }

  get totalPayable() {
    return +(this.subtotal + this.totalTax + this.packingCharges - this.discount).toFixed(2);
  }

  selectTable(tableId: number) {
    const table = this.tables.find((t: any) => t.id === tableId);
    if (table?.isOccupied) {
      alert(`Table ${tableId} is already occupied!`);
      return;
    }
    this.selectedTable = tableId;
    this.customerName = '';
    this.customerMobile = '';
    this.cart = [];
    this.discount = 0;
    this.packingCharges = 0;
    this.noOfPax = 1;
  }

  selectCategory(categoryId: number) {
    this.activeCategory = categoryId;
  }

  addToCart(item: any) {
    const existing = this.cart.find(c => c.id === item.id);
    if (existing) {
      existing.quantity++;
      existing.total = existing.quantity * existing.price;
    } else {
      this.cart.push({ ...item, quantity: 1, total: item.price });
    }
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  updateQuantity(index: number, change: number) {
    const item = this.cart[index];
    const newQty = item.quantity + change;
    if (newQty <= 0) {
      this.removeFromCart(index);
    } else {
      item.quantity = newQty;
      item.total = item.quantity * item.price;
    }
  }

  applyDiscount() {
    const disc = prompt('Enter discount amount:', '0');
    if (disc && !isNaN(parseFloat(disc))) {
      this.discount = parseFloat(disc);
    }
  }

  applyPackingCharges() {
    const charges = prompt('Enter packing charges:', '0');
    if (charges && !isNaN(parseFloat(charges))) {
      this.packingCharges = parseFloat(charges);
    }
  }

  addCashDigit(digit: string) {
    if (digit === 'Clear') {
      this.cashAmount = '';
    } else if (digit === 'Enter') {
      if (this.cashAmount) {
        const cash = parseFloat(this.cashAmount);
        if (cash >= this.totalPayable) {
          const returnAmount = cash - this.totalPayable;
          alert(`Cash: ₹${cash}\nReturn: ₹${returnAmount}`);
          this.makePayment();
        } else {
          alert(`Insufficient cash! Need ₹${this.totalPayable - cash} more.`);
        }
      }
    } else {
      this.cashAmount += digit;
    }
  }

  makePayment() {
    if (this.cart.length === 0) {
      alert('Cart is empty! Please add items.');
      return;
    }

    this.tokenNumber++;
    this.billNumber++;
    
    this.todaySummary.totalSales += this.totalPayable;
    this.todaySummary.totalOrders++;
    this.todaySummary.averageBill = this.todaySummary.totalSales / this.todaySummary.totalOrders;
    this.todaySummary.runningToken++;
    this.todaySummary.billedToken++;

    const table = this.tables.find((t: any) => t.id === this.selectedTable);
    if (table) {
      table.isOccupied = true;
      table.customerName = this.customerName || 'Guest';
      table.orderAmount = this.totalPayable;
      table.tokenNo = this.tokenNumber;
    }

    alert(`✅ Payment Successful!\n\nThank you!`);
    
    this.selectedTable = null;
    this.cart = [];
    this.discount = 0;
    this.packingCharges = 0;
    this.customerName = '';
    this.customerMobile = '';
    this.cashAmount = '';
  }

  backToTables() {
    this.selectedTable = null;
    this.cart = [];
  }

  clearCart() {
    if (confirm('Clear entire cart?')) {
      this.cart = [];
      this.discount = 0;
      this.packingCharges = 0;
    }
  }
}