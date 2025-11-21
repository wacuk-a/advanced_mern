import { Request, Response } from 'express';

export const audioEvidenceController = {
  // Save audio recording metadata
  saveRecording: async (req: Request, res: Response) => {
    try {
      const { audioData, duration, timestamp } = req.body;
      
      // In a real app, you'd save to database
      // For now, just return success
      res.json({
        success: true,
        message: "Audio recording saved successfully",
        id: `audio_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to save audio recording"
      });
    }
  },

  // Get user's audio recordings
  getRecordings: async (req: Request, res: Response) => {
    try {
      // Return mock data for now
      res.json({
        recordings: [
          {
            id: "audio_1",
            duration: "30s",
            timestamp: new Date().toISOString(),
            title: "Incident Recording"
          }
        ]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch recordings"
      });
    }
  }
};
