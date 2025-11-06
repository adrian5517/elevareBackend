const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1';
  }

  async analyzeCall(transcription, duration) {
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured');
      return null;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an AI coach analyzing real estate sales calls. Provide insights on sentiment, key points, missed opportunities, and actionable suggestions.'
            },
            {
              role: 'user',
              content: `Analyze this call transcription (${duration} seconds):\n\n${transcription}\n\nProvide: 1) Sentiment, 2) Key points, 3) Detected interests, 4) Missed opportunities, 5) Suggested actions, 6) Confidence score (1-10)`
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const analysis = response.data.choices[0].message.content;
      return this.parseCallAnalysis(analysis);
    } catch (error) {
      console.error('AI Analysis Error:', error.message);
      return null;
    }
  }

  parseCallAnalysis(analysis) {
    return {
      sentiment: 'neutral',
      keyPoints: [],
      detectedInterest: [],
      missedOpportunities: [],
      suggestedActions: [],
      confidenceScore: 7
    };
  }

  async analyzeMoodPatterns(moodEntries) {
    if (!this.apiKey) return null;

    try {
      const data = moodEntries.map(entry => ({
        date: entry.date,
        mood: entry.mood,
        energy: entry.energy,
        confidence: entry.confidence
      }));

      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an AI analyzing emotional and performance patterns. Identify correlations and provide actionable insights.'
            },
            {
              role: 'user',
              content: `Analyze these mood/performance entries:\n\n${JSON.stringify(data, null, 2)}\n\nProvide insights, patterns, and recommendations.`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        insights: [],
        patterns: [],
        recommendations: []
      };
    } catch (error) {
      console.error('AI Mood Analysis Error:', error.message);
      return null;
    }
  }

  async generateScript(context) {
    if (!this.apiKey) return null;

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert real estate sales coach. Generate professional, persuasive scripts.'
            },
            {
              role: 'user',
              content: `Generate a sales script for: ${context}`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI Script Generation Error:', error.message);
      return null;
    }
  }
}

module.exports = new AIService();
