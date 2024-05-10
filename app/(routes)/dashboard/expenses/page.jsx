"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";


import { desc, eq, getTableColumns, sql } from "drizzle-orm";

import ExpenseListTable from "./_components/ExpenseListTable";
import { db } from "../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../utils/schema";

function ExpensesPage() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  useEffect(() => {
    user && getBudgetsList();
  }, [user]);

  const getBudgetsList = async () => {
    const result = await db.select({
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
    <div className="p-5">
      <h2 className="font-bold text-3xl">My Expenses</h2>
      <ExpenseListTable
        expensesList={expenseList}
        refreshData={() => getBudgetsList()}
      />
    </div>
  );
}

export default ExpensesPage;
