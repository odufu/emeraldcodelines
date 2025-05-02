## **4. Explanation of Bitwise Operators **

---

### 🔹 **4.1 AND Operator `&`**

**What it does:**  
Checks _each bit_ in both numbers.  
**If both bits are 1, result is 1**. Else, result is 0.

```c
int a = 5;  // 00000101
int b = 3;  // 00000011
int c = a & b; // 00000001 -> 1
```

🧠 Think: "Are both bits ON?"

| Bit of a | Bit of b | Result |
| -------- | -------- | ------ |
| 1        | 1        | 1 ✅   |
| 1        | 0        | 0 ❌   |
| 0        | 1        | 0 ❌   |
| 0        | 0        | 0 ❌   |

---

### 🔹 **4.2 OR Operator `|`**

**What it does:**  
Checks _each bit_.  
**If at least one bit is 1, result is 1**.

```c
int c = a | b; // 00000111 -> 7
```

🧠 Think: "Is at least one bit ON?"

| Bit of a | Bit of b | Result |
| -------- | -------- | ------ |
| 1        | 1        | 1 ✅   |
| 1        | 0        | 1 ✅   |
| 0        | 1        | 1 ✅   |
| 0        | 0        | 0 ❌   |

---

### 🔹 **4.3 XOR Operator `^`**

**What it does:**  
Compares bits.  
**If the bits are different, result is 1**.  
If same, result is 0.

```c
int c = a ^ b; // 00000110 -> 6
```

🧠 Think: "Are the bits different?"

| Bit of a | Bit of b | Result |
| -------- | -------- | ------ |
| 1        | 1        | 0 ❌   |
| 1        | 0        | 1 ✅   |
| 0        | 1        | 1 ✅   |
| 0        | 0        | 0 ❌   |

---

### 🔹 **4.4 NOT Operator `~`**

**What it does:**  
Flips **every bit**.  
1 becomes 0, and 0 becomes 1.

```c
int a = 5;     // 00000101
int c = ~a;    // 11111010 (on 8-bit) -> usually -6 (2’s complement)
```

🧠 Think: "Turn ON to OFF, OFF to ON."

| Original Bit | Flipped Bit |
| ------------ | ----------- |
| 0            | 1 ✅        |
| 1            | 0 ✅        |

---

### 🔹 **4.5 Left Shift `<<`**

**What it does:**  
Moves all bits to the **left**, and fills in 0s on the right.

```c
int a = 5;     // 00000101
int c = a << 1; // 00001010 -> 10
```

🧠 Think: "Push bits to the left, like moving people forward in a line."

- Every left shift doubles the number.

---

### 🔹 **4.6 Right Shift `>>`**

**What it does:**  
Moves all bits to the **right**, and fills in 0s (for unsigned).

```c
int a = 5;     // 00000101
int c = a >> 1; // 00000010 -> 2
```

🧠 Think: "Push bits to the right, like moving people backward in a line."

- Every right shift halves the number (ignoring fractions).

---
