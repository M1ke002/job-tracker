# import os
# import sys

# #append the path to the 'backend' folder to the system path
# sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

# from tests.base_test_case import BaseTestCase
# import unittest

# class TestContactRoutes(BaseTestCase):
#     def setUp(self):
#         super().setUp()
#         self.contract = {
#             "jobId": 1,
#             "personName": "John Doe",
#             "personPosition": "Software Developer",
#             "personLinkedin": "https://www.linkedin.com/in/johndoe",
#             "personEmail": "",
#             "note": "This is a note"
#         }

#     def create_contact(self):
#         response = self.client.post("/api/contacts", json=self.contract)
#         return response

#     def test_create_contact(self):
#         # Act
#         response = self.create_contact()

#         # Assert
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(response.json, {
#             "id": 1,
#             "job_id": 1,
#             "person_name": "John Doe",
#             "person_position": "Software Developer",
#             "person_linkedin": "https://www.linkedin.com/in/johndoe",
#             "person_email": "",
#             "note": "This is a note"
#         })

#     def test_get_contact(self):
#         # Arrange
#         self.create_contact()

#         # Act
#         response = self.client.get("/api/contacts")

#         # Assert
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(response.json, [{
#             "id": 1,
#             "job_id": 1,
#             "person_name": "John Doe",
#             "person_position": "Software Developer",
#             "person_linkedin": "https://www.linkedin.com/in/johndoe",
#             "person_email": "",
#             "note": "This is a note"
#         }])

#     def test_edit_contact(self):
#         # Arrange
#         self.create_contact()
#         contact = {
#             "personName": "Jane Doe",
#             "personPosition": "Software Developer",
#             "personLinkedin": "https://www.linkedin.com/in/janedoe",
#             "personEmail": "",
#             "note": "This is an updated note"
#         }

#         # Act
#         response = self.client.put("/api/contacts/1", json=contact)

#         # Assert
#         self.assertEqual(response.status_code, 200)
#         self.assertEqual(response.json, {
#             "id": 1,
#             "job_id": 1,
#             "person_name": "Jane Doe",
#             "person_position": "Software Developer",
#             "person_linkedin": "https://www.linkedin.com/in/janedoe",
#             "person_email": "",
#             "note": "This is an updated note"
#         })

#     def test_delete_contact(self):
#         # Arrange
#         self.create_contact()

#         # Act
#         response = self.client.delete("/api/contacts/1")

#         # Assert
#         self.assertEqual(response.status_code, 200)


# if __name__ == "__main__":
#     #set verbosity=2 to see the test results in the console
#     unittest.main(verbosity=2)
