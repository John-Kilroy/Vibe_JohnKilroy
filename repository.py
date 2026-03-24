from models import Employee
from database import get_db


def get_all_employees():
    with get_db() as db:
        try:
            return db.query(Employee).all()
        except Exception:
            db.rollback()
            raise


def create_employee(name, department, salary):
    with get_db() as db:
        try:
            emp = Employee(name=name, department=department, salary=salary)
            db.add(emp)
            db.commit()
            db.refresh(emp)
            return emp
        except Exception:
            db.rollback()
            raise