import { PracticeContext } from '@/types';

export const practiceContexts: PracticeContext[] = [
  {
    id: '1',
    type: 'interview',
    title: 'Leadership Challenge',
    content: `You are being interviewed for a senior management position at a growing tech company. The interviewer wants to understand how you handle team conflicts and motivate underperforming team members.

Scenario: In your previous role, you inherited a team of 8 developers. Two senior members had ongoing conflicts that were affecting team morale and productivity. Sprints were consistently delayed, and junior developers felt uncomfortable voicing their opinions in meetings.

Think about how you would describe your approach to resolving this situation, the specific steps you took, and the outcomes you achieved.`,
    questions: [
      "Walk me through how you initially assessed the situation with the conflicting team members.",
      "What specific strategies did you implement to improve team communication?",
      "How do you measure success when it comes to team dynamics and collaboration?"
    ]
  },
  {
    id: '2',
    type: 'article',
    title: 'The Future of Remote Work',
    content: `Recent studies indicate that hybrid work models are becoming the new standard for knowledge workers globally. A survey of 5,000 companies across 15 countries found that 73% plan to maintain some form of remote work permanently.

Key findings include:
• Employee productivity increased by 13% on average during remote work periods
• Companies reported 20-30% reduction in real estate costs
• Mental health concerns rose by 40% among fully remote workers
• Collaboration and innovation metrics showed mixed results

The challenge for organizations is finding the right balance. Companies must invest in technology infrastructure, redefine performance metrics, and create intentional moments for team bonding. The most successful hybrid models appear to be those with clear guidelines about which tasks require in-person collaboration.`,
    questions: [
      "Based on this article, what would you identify as the primary trade-offs of remote work?",
      "How would you address the mental health concerns mentioned while maintaining productivity benefits?",
      "If you were advising a company, what hybrid model would you recommend and why?"
    ]
  },
  {
    id: '3',
    type: 'case-study',
    title: 'Market Entry Strategy',
    content: `TechFlow, a successful B2B SaaS company based in the United States, is considering expanding into the European market. The company provides project management software to mid-sized enterprises with annual revenues between $10M-$100M.

Current situation:
• Annual revenue: $45 million
• Customer base: 2,500 companies (95% US-based)
• Main competitors in Europe: Established players with 60% market share
• Product: Cloud-based, currently hosted on US servers only

Challenges to consider:
• GDPR compliance requirements
• Local language support for 8 major European languages
• Different business cultures and sales cycles
• Currency and pricing considerations
• Need for local customer support

The board has allocated $5 million for the first year of European expansion and expects to reach profitability in this market within 3 years.`,
    questions: [
      "What would be your recommended approach for TechFlow's market entry strategy?",
      "How would you prioritize which European countries to target first?",
      "What key success metrics would you track in the first year of expansion?"
    ]
  },
  {
    id: '4',
    type: 'interview',
    title: 'Problem-Solving Under Pressure',
    content: `You are interviewing for a role as a Product Manager at a fintech startup. The company values quick thinking and structured problem-solving.

Scenario: Your company launched a new mobile payment feature last week. This morning, you received reports that approximately 5% of transactions are failing with an unclear error message. Customer complaints are flooding social media, and your largest enterprise client has scheduled an urgent call in 2 hours.

You need to explain how you would handle this crisis, coordinate with different teams, communicate with stakeholders, and prevent similar issues in the future.`,
    questions: [
      "What are the first three actions you would take upon learning about this issue?",
      "How would you communicate with the enterprise client during the urgent call?",
      "What process improvements would you implement to prevent similar situations?"
    ]
  },
  {
    id: '5',
    type: 'article',
    title: 'Artificial Intelligence in Healthcare',
    content: `The integration of artificial intelligence in healthcare diagnostics has shown remarkable progress in recent years. A comprehensive analysis of 50 clinical trials demonstrates that AI-assisted diagnosis achieves accuracy rates comparable to or exceeding human specialists in several areas.

Notable applications include:
• Radiology: AI systems detected 94% of breast cancers, compared to 88% by radiologists alone
• Dermatology: Deep learning models identified skin cancer with 95% accuracy
• Ophthalmology: Automated screening for diabetic retinopathy reduced diagnosis time by 70%

However, significant challenges remain. Implementation costs average $2-5 million for hospital systems. Integration with existing electronic health records proves difficult. Most critically, questions about liability and the role of AI in clinical decision-making remain unresolved.

Experts suggest that the future lies in human-AI collaboration rather than replacement, with AI serving as a "second opinion" that enhances physician capabilities.`,
    questions: [
      "What are the main barriers to widespread AI adoption in healthcare according to this article?",
      "How would you explain the concept of human-AI collaboration in diagnostics to a non-technical audience?",
      "What ethical considerations should hospitals prioritize when implementing AI diagnostic tools?"
    ]
  },
  {
    id: '6',
    type: 'case-study',
    title: 'Sustainability Initiative',
    content: `GreenRetail is a national grocery chain with 450 stores facing pressure from consumers and investors to improve its environmental impact. Currently, the company generates approximately 50,000 tons of food waste annually, and its supply chain accounts for 2.3 million tons of CO2 emissions.

Recent developments:
• Competitor launched a "zero waste by 2030" campaign, gaining significant media attention
• Investors managing $2 billion in assets sent a letter demanding ESG improvements
• Customer surveys show 68% would pay 5-10% more for sustainably sourced products
• Current profit margins: 3.2% (industry average: 2.8%)

Available options being considered:
1. Partner with food rescue organizations (estimated cost: $3M/year)
2. Implement AI-based demand forecasting to reduce overstock (cost: $15M implementation)
3. Transition to renewable energy for all stores (cost: $45M over 5 years)
4. Launch a premium "sustainable" product line with higher margins

The CEO wants a recommendation for a phased approach that balances stakeholder expectations with financial sustainability.`,
    questions: [
      "How would you prioritize these sustainability initiatives and why?",
      "What metrics would you use to measure the success of your recommended approach?",
      "How would you communicate these initiatives to different stakeholder groups?"
    ]
  }
];

export function getRandomContext(): PracticeContext {
  const randomIndex = Math.floor(Math.random() * practiceContexts.length);
  return practiceContexts[randomIndex];
}
