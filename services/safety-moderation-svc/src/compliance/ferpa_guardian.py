"""FERPA compliance guardian"""

from typing import Dict, List, Optional
from datetime import datetime


class FERPAGuardian:
    """Enforce FERPA (Family Educational Rights and Privacy Act) compliance"""

    def __init__(self):
        self.protected_categories = [
            "grades",
            "test_scores",
            "assessments",
            "disciplinary_records",
            "iep_data",
            "special_education",
            "attendance",
            "health_records"
        ]

    async def check_access_authorization(
        self,
        requester_id: str,
        requester_role: str,
        student_id: str,
        data_category: str
    ) -> Dict:
        """Check if requester is authorized to access student data"""

        # Check if data is protected by FERPA
        if data_category not in self.protected_categories:
            return {
                "authorized": True,
                "reason": "Not protected under FERPA"
            }

        # Define authorized roles
        authorized_roles = self._get_authorized_roles(data_category)

        if requester_role not in authorized_roles:
            return {
                "authorized": False,
                "reason": "Role not authorized for this data category",
                "required_roles": authorized_roles
            }

        # Verify relationship (parent/guardian, teacher, etc.)
        relationship_valid = await self._verify_relationship(
            requester_id,
            student_id,
            requester_role
        )

        if not relationship_valid:
            return {
                "authorized": False,
                "reason": "No valid relationship to student"
            }

        return {
            "authorized": True,
            "data_category": data_category,
            "access_level": self._get_access_level(requester_role)
        }

    def _get_authorized_roles(self, data_category: str) -> List[str]:
        """Get roles authorized for data category"""
        # Most educational records
        standard_roles = [
            "parent",
            "guardian",
            "teacher",
            "school_admin",
            "district_admin"
        ]

        # Sensitive records
        if data_category in ["iep_data", "special_education", "health_records"]:
            return [
                "parent",
                "guardian",
                "special_ed_teacher",
                "school_counselor",
                "school_admin"
            ]

        return standard_roles

    async def _verify_relationship(
        self,
        requester_id: str,
        student_id: str,
        role: str
    ) -> bool:
        """Verify requester has valid relationship to student"""
        # In production, check database for relationships
        # For now, return True as placeholder
        return True

    def _get_access_level(self, role: str) -> str:
        """Get access level for role"""
        access_levels = {
            "parent": "full",
            "guardian": "full",
            "teacher": "classroom_relevant",
            "school_admin": "full",
            "district_admin": "aggregated",
            "researcher": "anonymized"
        }
        return access_levels.get(role, "none")

    async def anonymize_records(
        self,
        records: List[Dict],
        anonymization_level: str = "standard"
    ) -> List[Dict]:
        """Anonymize student records for research or reporting"""
        anonymized = []

        for record in records:
            anon_record = record.copy()

            # Remove direct identifiers
            identifiers_to_remove = [
                "name",
                "student_id",
                "ssn",
                "email",
                "phone",
                "address"
            ]

            for identifier in identifiers_to_remove:
                if identifier in anon_record:
                    del anon_record[identifier]

            # Add anonymized ID
            anon_record["anonymized_id"] = self._generate_anon_id(
                record.get("student_id", "")
            )

            # Generalize sensitive data
            if "date_of_birth" in anon_record:
                anon_record["age_range"] = self._get_age_range(
                    anon_record["date_of_birth"]
                )
                del anon_record["date_of_birth"]

            if "zip_code" in anon_record:
                anon_record["region"] = anon_record["zip_code"][:3] + "XX"
                del anon_record["zip_code"]

            anonymized.append(anon_record)

        return anonymized

    def _generate_anon_id(self, student_id: str) -> str:
        """Generate anonymized ID"""
        import hashlib
        return hashlib.sha256(student_id.encode()).hexdigest()[:16]

    def _get_age_range(self, dob: datetime) -> str:
        """Convert DOB to age range"""
        age = (datetime.utcnow() - dob).days // 365

        if age < 6:
            return "0-5"
        elif age < 11:
            return "6-10"
        elif age < 14:
            return "11-13"
        elif age < 18:
            return "14-17"
        return "18+"

    async def audit_data_access(
        self,
        requester_id: str,
        student_id: str,
        data_accessed: Dict,
        purpose: str
    ) -> Dict:
        """Create audit trail for data access"""
        audit_entry = {
            "timestamp": datetime.utcnow(),
            "requester_id": requester_id,
            "student_id": student_id,
            "data_categories": list(data_accessed.keys()),
            "purpose": purpose,
            "compliance": "FERPA"
        }

        # In production, store in database
        return audit_entry
