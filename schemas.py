from pydantic import BaseModel, constr, condecimal


class EmployeeCreate(BaseModel):
    name: constr(min_length=1)
    department: constr(min_length=1)
    salary: condecimal(gt=0)


class AccountCreate(BaseModel):
    userId: int
    accountType: constr(min_length=1)


class TransactionCreate(BaseModel):
    amount: condecimal(gt=0)