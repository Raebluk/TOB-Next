from dotenv import load_dotenv
from flask import Flask
from flask_restful import reqparse, Api, Resource

import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


from profile_image import build_profile_image


load_dotenv("../.env")
# Flask REST API to handle profile image generation request
class ProfileImage(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("dcName", type=str)
        parser.add_argument("dcTag", type=str)
        parser.add_argument("level", type=int)
        parser.add_argument("expCurrentLevel", type=int)
        parser.add_argument("expCurrentUser", type=int)
        parser.add_argument("dcId", type=str)
        parser.add_argument("avatarId", type=str)
        args = parser.parse_args()
        try:
            build_profile_image(args)
            return {
                "message": "Profile image generated successfully",
                "error": None,
            }, 200
        except Exception as e:
            print(e)
            return {"error": f"Unexpected error occurred: {str(e)}"}, 500


# Initialize Flask application and API
app = Flask(__name__)
api = Api(app)

# Add the ProfileImage resource to the API
api.add_resource(ProfileImage, "/profile")

if __name__ == "__main__":
    app.run(debug=True, port=os.getenv("SERVER_PORT"))
