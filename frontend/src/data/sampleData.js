export const sampleUser = {
  name: "Ananya",
  city: "Satna",
  avatar: "https://placehold.co/96x96"
};

export const sampleCourses = [
  {
    id: "course-1",
    title: "Class 10 Science",
    description: "आसान भाषा में विज्ञान सीखें",
    subject: "Science",
    progress: 62,
    chapters: [
      {
        id: "chapter-1",
        title: "रासायनिक अभिक्रिया",
        completed: true,
        topics: [
          {
            id: "topic-1",
            title: "ऑक्सीकरण और अपचयन",
            content:
              "ऑक्सीकरण मतलब किसी पदार्थ में ऑक्सीजन मिलना या इलेक्ट्रॉन का हटना। अपचयन इसका उल्टा है।",
            completed: true
          },
          {
            id: "topic-2",
            title: "दैनिक जीवन के उदाहरण",
            content:
              "लोहे पर जंग लगना ऑक्सीकरण का आसान उदाहरण है।",
            completed: false
          }
        ]
      },
      {
        id: "chapter-2",
        title: "जीव विज्ञान की नींव",
        completed: false,
        topics: [
          {
            id: "topic-3",
            title: "कोशिका की संरचना",
            content:
              "कोशिका जीवन की सबसे छोटी इकाई है, जिसमें नाभिक, कोशिका द्रव्य और झिल्ली होती है।",
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: "course-2",
    title: "Basic English Grammar",
    description: "Daily use English for real-life situations",
    subject: "English",
    progress: 35,
    chapters: [
      {
        id: "chapter-3",
        title: "Tenses",
        completed: false,
        topics: []
      }
    ]
  }
];
