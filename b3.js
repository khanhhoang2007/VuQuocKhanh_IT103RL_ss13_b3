const tickets = [
  {
    pnr: "VN10001",
    passengerName: "Nguyen Van An",
    ticketClass: "ECONOMY",
    memberLevel: "NONE",
    baggageList: [
      {
        name: "Vali",
        weight: 18,
        type: "NORMAL",
      },
      {
        name: "Gậy golf",
        weight: 5,
        type: "BULKY",
      },
      {
        name: "Thu cung",
        weight: 3,
        type: "PET",
      },
    ],
  },
  {
    pnr: "VN10002",
    passengerName: "Tran Thi Binh",
    ticketClass: "BUSINESS",
    memberLevel: "TITAN",
    baggageList: [
      {
        name: "Vali 1",
        weight: 20,
        type: "NORMAL",
      },
      {
        name: "Vali 2",
        weight: 15,
        type: "NORMAL",
      },
    ],
  },
];

const BULKY_FEE = 200000;
const PET_FEE = 500000;

// tim ve theo ma PNR
function findTicketByPnr(pnr) {
  return tickets.find((ticket) => ticket.pnr === pnr);
}

// tinh han muc hanh ly mien cuoc
function calculateFreeWeight(ticket) {
  let freeWeight = 20;

  if (ticket.ticketClass === "BUSINESS") {
    freeWeight = 30;
  }

  if (
    ticket.memberLevel === "TITAN" ||
    ticket.memberLevel === "GOLD" ||
    ticket.memberLevel === "PLATINUM"
  ) {
    freeWeight += 10;
  }

  return freeWeight;
}

// tinh phi hanh ly qua can
function calculateExcessFee(excessWeight) {
  if (excessWeight <= 0) {
    return 0;
  }

  if (excessWeight <= 5) {
    return excessWeight * 60000;
  }

  return 5 * 60000 + (excessWeight - 5) * 80000;
}

// tinh tong phu phi hanh ly
function calculateBaggageSurcharge(ticket, baggageList) {
  let totalWeight = 0;
  let bulkyCount = 0;
  let petCount = 0;

  baggageList.forEach((baggage) => {
    totalWeight += baggage.weight;

    if (baggage.type === "BULKY") {
      bulkyCount++;
    }

    if (baggage.type === "PET") {
      petCount++;
    }
  });

  let freeWeight = calculateFreeWeight(ticket);
  let excessWeight = Math.max(0, totalWeight - freeWeight);
  let excessFee = calculateExcessFee(excessWeight);
  let bulkyFee = bulkyCount * BULKY_FEE;
  let petFee = petCount * PET_FEE;
  let totalFee = excessFee + bulkyFee + petFee;

  return {
    totalWeight: totalWeight,
    freeWeight: freeWeight,
    excessWeight: excessWeight,
    excessFee: excessFee,
    bulkyCount: bulkyCount,
    bulkyFee: bulkyFee,
    petCount: petCount,
    petFee: petFee,
    totalFee: totalFee,
  };
}

// dinh dang tien te
function formatMoney(amount) {
  return amount.toLocaleString("vi-VN") + " VND";
}

// in bien lai thanh toan
function printReceipt(ticket, result, baggageList) {
  console.log("\n" + "=".repeat(60));
  console.log("              BIEN LAI PHU PHI HANH LY");
  console.log("=".repeat(60));

  console.log(`Ma dat cho : ${ticket.pnr}`);
  console.log(`Hanh khach : ${ticket.passengerName}`);
  console.log(`Hang ve    : ${ticket.ticketClass}`);
  console.log(`Hoi vien   : ${ticket.memberLevel}`);

  console.log("-".repeat(60));
  console.log("CHI TIET HANH LY");

  baggageList.forEach((baggage, index) => {
    console.log(
      `${String(index + 1).padEnd(4)}` +
        `${baggage.name.padEnd(22)}` +
        `${String(baggage.weight + " kg").padEnd(10)}` +
        `${baggage.type}`,
    );
  });

  console.log("-".repeat(60));
  console.log(`Tong trong luong     : ${result.totalWeight} kg`);
  console.log(`Han muc mien cuoc    : ${result.freeWeight} kg`);
  console.log(`Trong luong qua can  : ${result.excessWeight} kg`);
  console.log(`Phi qua can          : ${formatMoney(result.excessFee)}`);
  console.log(`Phi hanh ly cong kenh: ${formatMoney(result.bulkyFee)}`);
  console.log(`Phi van chuyen pet   : ${formatMoney(result.petFee)}`);
  console.log("-".repeat(60));
  console.log(`TONG THANH TOAN      : ${formatMoney(result.totalFee)}`);
  console.log("=".repeat(60));
  console.log("       CAM ON QUY KHACH DA SU DUNG DICH VU");
  console.log("=".repeat(60));
}

// them kien hanh ly
function addBaggage(ticket) {
  let name = prompt("Nhap ten kien hanh ly:");

  if (name === null || name.trim() === "") {
    console.log("Ten kien hang khong hop le!");
    return;
  }

  let inputWeight = prompt("Nhap trong luong (kg):");

  if (inputWeight === null || inputWeight.trim() === "") {
    console.log("Trong luong khong hop le!");
    return;
  }

  let weight = Number(inputWeight);

  if (!Number.isFinite(weight) || weight <= 0) {
    console.log("Trong luong phai la so lon hon 0!");
    return;
  }

  let type = prompt(
    "Chon loai hanh ly:\n" +
      "1. Thong thuong\n" +
      "2. Cong kenh\n" +
      "3. Thu cung",
  );

  if (type === null) {
    return;
  }

  if (type !== "1" && type !== "2" && type !== "3") {
    console.log("Loai hanh ly khong hop le!");
    return;
  }

  let baggageType = "NORMAL";

  if (type === "2") {
    baggageType = "BULKY";
  } else if (type === "3") {
    baggageType = "PET";
  }

  ticket.baggageList.push({
    name: name.trim(),
    weight: weight,
    type: baggageType,
  });

  console.log("Them kien hanh ly thanh cong!");
}

// xu ly thanh toan
function processBilling() {
  let pnr = prompt("Nhap ma dat cho PNR:");

  if (pnr === null || pnr.trim() === "") {
    console.log("Ma PNR khong hop le!");
    return;
  }

  pnr = pnr.trim().toUpperCase();

  let ticket = findTicketByPnr(pnr);

  if (!ticket) {
    console.log("Khong tim thay ve!");
    return;
  }

  let choice;

  do {
    console.log("\n========== QUAN LY HANH LY ==========");
    console.log("1. Xem danh sach kien hanh ly");
    console.log("2. Them kien hanh ly");
    console.log("3. Tinh phi va in bien lai");
    console.log("4. Quay lai menu chinh");

    choice = prompt("Nhap lua chon (1-4):");

    switch (choice) {
      case "1":
        if (ticket.baggageList.length === 0) {
          console.log("Chua co kien hanh ly!");
        } else {
          ticket.baggageList.forEach((baggage) => {
            console.log(
              baggage.name + " | " + baggage.weight + " kg | " + baggage.type,
            );
          });
        }
        break;

      case "2":
        addBaggage(ticket);
        break;

      case "3": {
        let result = calculateBaggageSurcharge(ticket, ticket.baggageList);

        printReceipt(ticket, result, ticket.baggageList);
        break;
      }

      case "4":
        console.log("Quay lai menu chinh!");
        break;

      default:
        console.log("Lua chon khong hop le!");
    }
  } while (choice !== "4" && choice !== null);
}

// menu chinh
function main() {
  let choice;

  do {
    console.log("\n========== BAGGAGE BILLING ==========");
    console.log("1. Hien thi danh sach ve");
    console.log("2. Quan ly hanh ly va thanh toan");
    console.log("3. Thoat chuong trinh");

    choice = prompt("Nhap lua chon (1-3):");

    switch (choice) {
      case "1":
        tickets.forEach((ticket) => {
          console.log(
            ticket.pnr +
              " | " +
              ticket.passengerName +
              " | " +
              ticket.ticketClass +
              " | " +
              ticket.memberLevel,
          );
        });
        break;

      case "2":
        processBilling();
        break;

      case "3":
        console.log("Da thoat chuong trinh!");
        break;

      default:
        if (choice !== null) {
          console.log("Lua chon khong hop le!");
        }
    }
  } while (choice !== "3" && choice !== null);
}

// khoi chay chuong trinh
main();
