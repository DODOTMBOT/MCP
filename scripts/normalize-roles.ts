import { prisma } from "@/lib/db";

// Run with: ts-node scripts/normalize-roles.ts (or add an npm script)
async function main() {
  const mapToCanonical: Record<string, string> = {
    owner: "owner",
    OWNER: "owner",
    Owner: "owner",
    admin: "owner", // if any old values existed
    partner: "partner",
    PARTNER: "partner",
    Partner: "partner",
    point: "point",
    POINT: "point",
    Point: "point",
    employee: "employee",
    EMPLOYEE: "employee",
    Employee: "employee",
  };

  const users = await prisma.user.findMany({ select: { id: true, role: true } });
  let updated = 0;
  for (const u of users) {
    const nextRole = mapToCanonical[u.role] ?? u.role?.toLowerCase();
    if (nextRole && nextRole !== u.role) {
      await prisma.user.update({ where: { id: u.id }, data: { role: nextRole } });
      updated++;
    }
  }
  console.log(`Roles normalized. Updated users: ${updated}`);
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});


