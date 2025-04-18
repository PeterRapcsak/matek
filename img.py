# Script to generate exam question and solution links from vantus.hu

base_url = "https://vantus.hu/kep/erettsegi_emelt"
start_year = 2005
end_year = 2024
set_range = range(1, 4)  # 1 to 3
question_range = range(1, 10)  # 1 to 9

with open("links.txt", "w", encoding="utf-8") as file:
    for year in range(start_year, end_year + 1):
        for set_number in set_range:
            for question_number in question_range:
                # Question link
                question_link = f"{base_url}/{year}_{set_number}/vantus_hu_erettsegi_emelt_{year}_{set_number}_{question_number}.jpg"
                file.write(question_link + "\n")

                # Solution link
                solution_link = f"{base_url}/{year}_{set_number}/vantus_hu_erettsegi_emelt_{year}_{set_number}_{question_number}j.jpg"
                file.write(solution_link + "\n")

print("Links generated and saved to links.txt ✅")
