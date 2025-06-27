def generate_score(blinks, frames, emotion, fillers):
    score = 100
    if blinks > frames // 50:
        score -= 10
    if emotion in ["sad", "angry"]:
        score -= 10
    if len(fillers) > 2:
        score -= 10
    return max(score, 0)

def get_suggestions(emotion, fillers):
    suggestions = []
    if emotion in ["sad", "angry"]:
        suggestions.append("Try to maintain a positive and confident facial expression.")
    if fillers:
        suggestions.append("Avoid using filler words like " + ", ".join(fillers) + ".")
    suggestions.append("Speak clearly and maintain eye contact with the camera.")
    return suggestions
