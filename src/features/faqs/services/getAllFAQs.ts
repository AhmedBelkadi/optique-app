import { prisma } from '@/lib/prisma';
import { faqSchema } from '../schema/faqSchema';

export async function getAllFAQs() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' }
    });

    const validatedData = faqs.map(faq => 
      faqSchema.parse(faq)
    );

    // Group FAQs by theme based on question content
    const groupedFAQs = groupFAQsByTheme(validatedData);

    return {
      success: true,
      data: validatedData,
      groupedData: groupedFAQs,
      message: 'FAQs retrieved successfully'
    };
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return {
      success: false,
      data: [],
      groupedData: {},
      message: 'Failed to fetch FAQs'
    };
  }
}

// Helper function to group FAQs by theme
function groupFAQsByTheme(faqs: any[]) {
  const themes: { [key: string]: any[] } = {
    'Eye Care & Exams': [],
    'Frames & Glasses': [],
    'Contact Lenses': [],
    'Appointments & Hours': [],
    'Insurance & Warranty': [],
    'General Questions': [],
  };

  faqs.forEach(faq => {
    const question = faq.question.toLowerCase();
    const answer = faq.answer.toLowerCase();

    // Determine theme based on question/answer content
    if (question.includes('exam') || question.includes('eye care') || question.includes('vision') || 
        answer.includes('exam') || answer.includes('eye care') || answer.includes('vision')) {
      themes['Eye Care & Exams'].push(faq);
    } else if (question.includes('frame') || question.includes('glasses') || question.includes('lens') ||
               answer.includes('frame') || answer.includes('glasses') || answer.includes('lens')) {
      themes['Frames & Glasses'].push(faq);
    } else if (question.includes('contact') || question.includes('fitting') ||
               answer.includes('contact') || answer.includes('fitting')) {
      themes['Contact Lenses'].push(faq);
    } else if (question.includes('appointment') || question.includes('hour') || question.includes('time') ||
               answer.includes('appointment') || answer.includes('hour') || answer.includes('time')) {
      themes['Appointments & Hours'].push(faq);
    } else if (question.includes('insurance') || question.includes('warranty') || question.includes('coverage') ||
               answer.includes('insurance') || answer.includes('warranty') || answer.includes('coverage')) {
      themes['Insurance & Warranty'].push(faq);
    } else {
      themes['General Questions'].push(faq);
    }
  });

  // Remove empty theme groups
  Object.keys(themes).forEach(theme => {
    if (themes[theme].length === 0) {
      delete themes[theme];
    }
  });

  return themes;
}
