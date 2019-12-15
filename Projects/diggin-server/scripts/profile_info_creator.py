from app.models import *
from random import *
from app.utils import names, zips

try:
    data = ProfileInfo.objects.all()
    profiles_in_use = [acc.profile_details.id for acc in Account.objects.all()]
    profiles = [profile for profile in data if profile.id not in profiles_in_use]

    skills = []
    education = []
    experience = []
    summary = []

    for i in data:
        try:
            if i.data['skills']:
                for x in i.data['skills']:
                    skills.append(x)
            if i.data['education']:
                for x in i.data['education']:
                    education.append(x)
            if i.data['experience']:
                for x in i.data['experience']:
                    experience.append(x)
            summary.append(i.data['summary'])
        except:
            continue

    for p in profiles:
        acc_skills = []
        for i in range(5):
            skill = choice(skills)
            if skill not in acc_skills:
                acc_skills.append(skill)
            else:
                i -= 1
                continue

        gender = 'man' if randint(0, 1) == 1 else 'woman'
        if gender == 'man':
            name = choice(names.MALE_FIRST_NAMES)
        else:
            name = choice(names.FEMALE_FIRST_NAMES)

        ProfileInfoCombination.objects.create(first_name=name.capitalize(), last_name=choice(names.LAST_NAMES), zip_code=choice(
            zips.ZIP_CODE),  skills=acc_skills, education=choice(education), experience=choice(experience))

except Exception as e:
    print(str(e))
