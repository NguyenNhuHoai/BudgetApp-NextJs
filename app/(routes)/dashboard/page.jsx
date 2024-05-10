"use client";
import { useUser, UserButton } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import CardInfor from "./_components/CardInfor";
import { db } from "../../../utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "../../../utils/schema";
import BarChartDashboard from "../../../app/(routes)/dashboard/_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
function Dashboard() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  useEffect(() => {
    user && getBudgetsList();
  }, [user]);

  const getBudgetsList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
    getAllExpenses();
  };

  // Used to get all expenses along to us
  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.name,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Budgets.id));
    setExpenseList(result);
  };

  return (
    <div>
      <div className="p-8">
        <h2 className="font-bold text-3xl">Hi,{user?.fullName} ✌️</h2>
        <p className="text-gray-500">
          Here's what happenning with your money, Let Manage your expenses
        </p>
        <CardInfor budgetList={budgetList} />
        <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
          <div className="col-span-2">
            <BarChartDashboard budgetList={budgetList} />
          
            <ExpenseListTable
              expensesList={expenseList}
              refreshData={() => getBudgetsList()}
            />
          </div>
          <div className="grid gap-5">
            <h2 className="font-bold text-lg">Latest Budgets</h2>
            {budgetList.map((budget, index) => (
              <BudgetItem budget={budget} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
