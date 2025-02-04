import os
import json

import cv2
import numpy as np
from PIL import ImageFont, ImageDraw, Image

from dotenv import load_dotenv
import requests


load_dotenv("../.env")
# Get rank names from environment variable
rank_names = json.loads(os.getenv("RANK_NAMES", "{}"))
font_name = os.getenv("PROFILE_FONT", "ResourceHanRoundedCN-Regular")
font_path = os.path.abspath(os.path.join(os.path.dirname(__file__), f"{font_name}.ttf"))
# Load fonts
font = ImageFont.truetype(font_path, 80)
font_small = ImageFont.truetype(font_path, 60)

# Function to download avatar
def download_avatar(avatar_url):
    try:
        avatar = requests.get(avatar_url)
        avatar.raise_for_status()  # Check if the request was successful
        return avatar.content
    except requests.exceptions.RequestException as e:
        print(f"Failed to download avatar: {e}")
        return None
    except Exception as e:
        print(f"Unknown error when downloading avatar image...Please check: {e}")
        return None


# Find rank name based on level
def find_rank_name(level):
    """Return the rank name based on the user's level"""
    for key in rank_names:
        start, end = key.split("-")
        if int(start) <= level <= int(end):
            return rank_names[key]
    return "无名小卒"


# Trim text to ensure it doesn't get cut off in the middle of Chinese characters
def trim_text(text, max_length=12):
    """Ensure text is not truncated in the middle of Chinese characters"""
    if len(text) > max_length:
        text = text[:max_length]
        if len(text) > 1 and not text[-1].isascii():
            text = text[:-1] + "..."
        else:
            text = text + "..."
    return text


# Build the profile image
def build_profile_image(payload):
    dc_tag = payload["dcTag"]
    dc_name = payload["dcName"] if payload["dcName"] else ""
    level = payload["level"]
    exp_current_level = payload["expCurrentLevel"]
    exp_current_user = payload["expCurrentUser"]

    avatar_url = f"https://cdn.discordapp.com/avatars/{payload['dcId']}/{payload['avatarId']}.png"

    # Create a blank canvas
    canvas = cv2.imread("source.png", cv2.IMREAD_COLOR)
    canvas = cv2.resize(canvas, (1800, 300))

    # Try to download the avatar
    avatar_data = download_avatar(avatar_url)
    if avatar_data:
        with open("avatar.jpg", "wb") as f:
            f.write(avatar_data)
        avatar = cv2.imread("avatar.jpg", cv2.IMREAD_COLOR)
        avatar = cv2.resize(avatar, (225, 225))
        canvas[35:260, 90:315] = avatar
    else:
        # Use a default avatar if the download fails
        default_avatar = cv2.imread("default_avatar.png")
        default_avatar = cv2.resize(default_avatar, (225, 225))
        canvas[35:260, 90:315] = default_avatar

    # Convert the canvas to PIL Image for text drawing
    img_pil = Image.fromarray(canvas)
    draw = ImageDraw.Draw(img_pil)

    # Draw the user's name
    draw.text(
        (int(0.23 * canvas.shape[1]), int(0.04 * canvas.shape[0])),
        trim_text(dc_name),
        font=font,
        fill=(220, 120, 120, 0),
    )

    # Draw the rank text
    draw.text(
        (int(0.40 * canvas.shape[1]), int(0.40 * canvas.shape[0])),
        f"Rank: {find_rank_name(level)}",
        font=font_small,
        fill=(220, 220, 220, 0),
    )

    # Draw the level text
    draw.text(
        (int(0.23 * canvas.shape[1]), int(0.40 * canvas.shape[0])),
        f"Level: {level}",
        font=font_small,
        fill=(150, 180, 200, 0),
    )

    canvas = np.array(img_pil)

    # Draw the experience progress bar
    cv2.rectangle(
        canvas,
        (int(0.23 * canvas.shape[1]), int(0.78 * canvas.shape[0])),
        (int(0.72 * canvas.shape[1]), int(0.81 * canvas.shape[0])),
        (200, 200, 200),
        -10,
    )
    cv2.rectangle(
        canvas,
        (int(0.23 * canvas.shape[1]), int(0.78 * canvas.shape[0])),
        (
            int(0.23 * canvas.shape[1])
            + int(
                0.42 * (exp_current_user / (exp_current_level + 1e-3)) * canvas.shape[1]
            ),
            int(0.81 * canvas.shape[0]),
        ),
        (220, 130, 130),
        -1,
    )

    # Draw the experience text after the progress bar
    cv2.putText(
        canvas,
        f"{exp_current_user}/{exp_current_level} EXP",
        (int(0.74 * canvas.shape[1]), int(0.83 * canvas.shape[0])),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.2,
        (255, 255, 255),
        2,
    )

    # Save the image to a file
    output_dir = "profiles"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"profile_{dc_tag}.jpg")
    cv2.imwrite(output_path, canvas)

    # Remove the temporary avatar image file
    if os.path.exists("avatar.jpg"):
        os.remove("avatar.jpg")
