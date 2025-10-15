import PDFDocument from "pdfkit";
import userModel from "../models/userModel.js";

export const generateUserReport = async (req, res) => {
  try {
    // Fetch users and group by role
    const users = await userModel
      .find()
      .select("name email role createdAt lastLogin isActive")
      .sort({ role: 1 });

    const roles = {};
    users.forEach((u) => {
      if (!roles[u.role]) roles[u.role] = [];
      roles[u.role].push(u);
    });

    // Create PDF document
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const filename = `Users_Report_${Date.now()}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    doc.pipe(res);

    // Main title
    doc.fontSize(18).font("Helvetica-Bold").text("Users Report", { align: "center" });
    doc.moveDown(1.5);

    // Table layout config
    const colWidths = {
      name: 80,
      email: 150,
      role: 70,
      createdAt: 110,
      lastLogin: 110,
      isActive: 50,
    };

    const totalTableWidth =
      colWidths.name +
      colWidths.email +
      colWidths.role +
      colWidths.createdAt +
      colWidths.lastLogin +
      colWidths.isActive;

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const startX = doc.page.margins.left + (pageWidth - totalTableWidth) / 2;
    const rowHeight = 28;

    // Utility functions
    const formatDate = (d) =>
      d
        ? {
            date: new Date(d).toLocaleDateString("en-LK"),
            time: new Date(d).toLocaleTimeString("en-LK"),
          }
        : { date: "-", time: "-" };

    const truncate = (t, len) => (t && t.length > len ? t.substring(0, len - 3) + "..." : t);

    // Draw table header
    const drawTableHeader = (y) => {
      doc.rect(startX, y, totalTableWidth, 25).fill("#e8e8e8").stroke();
      doc.fillColor("#000").font("Helvetica-Bold").fontSize(12);

      let x = startX + 5;
      doc.text("Name", x, y + 6, { width: colWidths.name });
      x += colWidths.name;
      doc.text("Email", x, y + 6, { width: colWidths.email });
      x += colWidths.email;
      doc.text("Role", x, y + 6, { width: colWidths.role });
      x += colWidths.role;
      doc.text("Created At", x, y + 6, { width: colWidths.createdAt });
      x += colWidths.createdAt;
      doc.text("Last Login", x, y + 6, { width: colWidths.lastLogin });
      x += colWidths.lastLogin;
      doc.text("Active", x, y + 6, { width: colWidths.isActive, align: "center" });

      return y + 28;
    };

    // Generate tables per role
    const allRoles = Object.keys(roles);
    allRoles.forEach((role, index) => {
      const roleUsers = roles[role];
      if (index > 0) doc.addPage();

      doc.fontSize(14).font("Helvetica-Bold").fillColor("#000");
      doc.text(`Role: ${role.toUpperCase()}`, { align: "center" });
      doc.moveDown(0.8);

      let y = doc.y;
      y = drawTableHeader(y);

      roleUsers.forEach((u, i) => {
        if (y > doc.page.height - 80) {
          doc.addPage();
          doc.fontSize(14).font("Helvetica-Bold").fillColor("#000");
          doc.text(`Role: ${role.toUpperCase()} (continued)`, { align: "center" });
          doc.moveDown(0.8);
          y = drawTableHeader(doc.y);
        }

        const created = formatDate(u.createdAt);
        const lastLogin = formatDate(u.lastLogin);
        const activeStatus = u.isActive ? "Yes" : "No";

        if (i % 2 === 0) {
          doc.rect(startX, y - 2, totalTableWidth, rowHeight).fill("#f9f9f9").stroke();
        }

        doc.fillColor("#000").font("Helvetica").fontSize(10);
        let x = startX + 5;

        doc.text(truncate(u.name, 15), x, y, { width: colWidths.name });
        x += colWidths.name;
        doc.text(truncate(u.email, 25), x, y, { width: colWidths.email });
        x += colWidths.email;
        doc.text(u.role, x, y, { width: colWidths.role });
        x += colWidths.role;
        doc.text(created.date, x, y, { width: colWidths.createdAt });
        doc.text(created.time, x, y + 12, { width: colWidths.createdAt });
        x += colWidths.createdAt;
        doc.text(lastLogin.date, x, y, { width: colWidths.lastLogin });
        doc.text(lastLogin.time, x, y + 12, { width: colWidths.lastLogin });
        x += colWidths.lastLogin;
        doc.text(activeStatus, x, y, { width: colWidths.isActive, align: "center" });

        y += rowHeight;
      });
    });

    // ➕ Final summary table
    doc.addPage();
    doc.moveDown(1);
    doc.fontSize(16).font("Helvetica-Bold").fillColor("#000");
    doc.text("Summary", { align: "center" });
    doc.moveDown(1);

    // Summary table layout
    const summaryColWidths = { role: 150, active: 100, inactive: 100, total: 100 };
    const summaryTableWidth =
      summaryColWidths.role +
      summaryColWidths.active +
      summaryColWidths.inactive +
      summaryColWidths.total;
    const summaryStartX = doc.page.margins.left + (pageWidth - summaryTableWidth) / 2;
    let y = doc.y;

    // Header
    doc.rect(summaryStartX, y, summaryTableWidth, 25).fill("#e8e8e8").stroke();
    doc.fillColor("#000").font("Helvetica-Bold").fontSize(12);

    let x = summaryStartX + 5;
    doc.text("Role", x, y + 6, { width: summaryColWidths.role });
    x += summaryColWidths.role;
    doc.text("Active", x, y + 6, { width: summaryColWidths.active, align: "center" });
    x += summaryColWidths.active;
    doc.text("Inactive", x, y + 6, { width: summaryColWidths.inactive, align: "center" });
    x += summaryColWidths.inactive;
    doc.text("Total", x, y + 6, { width: summaryColWidths.total, align: "center" });
    y += 28;

    // Rows
    const totalUsers = users.length;
    let totalActive = 0;
    let totalInactive = 0;

    allRoles.forEach((r, i) => {
      const activeCount = roles[r].filter((u) => u.isActive).length;
      const inactiveCount = roles[r].length - activeCount;
      totalActive += activeCount;
      totalInactive += inactiveCount;

      if (i % 2 === 0) {
        doc.rect(summaryStartX, y - 2, summaryTableWidth, rowHeight).fill("#f9f9f9").stroke();
      }

      doc.fillColor("#000").font("Helvetica").fontSize(11);
      let x = summaryStartX + 5;
      doc.text(r.toUpperCase(), x, y, { width: summaryColWidths.role });
      x += summaryColWidths.role;
      doc.text(activeCount.toString(), x, y, { width: summaryColWidths.active, align: "center" });
      x += summaryColWidths.active;
      doc.text(inactiveCount.toString(), x, y, { width: summaryColWidths.inactive, align: "center" });
      x += summaryColWidths.inactive;
      doc.text(roles[r].length.toString(), x, y, { width: summaryColWidths.total, align: "center" });
      y += rowHeight;
    });

    // Footer total row
    doc.rect(summaryStartX, y, summaryTableWidth, 25).fill("#e8e8e8").stroke();
    doc.fillColor("#000").font("Helvetica-Bold").fontSize(12);
    doc.text("TOTAL", summaryStartX + 5, y + 6, { width: summaryColWidths.role });
    doc.text(totalActive.toString(), summaryStartX + summaryColWidths.role, y + 6, {
      width: summaryColWidths.active,
      align: "center",
    });
    doc.text(totalInactive.toString(), summaryStartX + summaryColWidths.role + summaryColWidths.active, y + 6, {
      width: summaryColWidths.inactive,
      align: "center",
    });
    doc.text(totalUsers.toString(), summaryStartX + summaryColWidths.role + summaryColWidths.active + summaryColWidths.inactive, y + 6, {
      width: summaryColWidths.total,
      align: "center",
    });

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ success: false, message: "Error generating report" });
  }
};
