class CommandService {
  private hotword = "hey maitri";
  private commands = ['open dashboard', 'open chat', 'open guardian', 'open co-pilot', 'open storyteller', 'open playmate'];

  public parse(transcript: string): string | null {
    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.startsWith(this.hotword)) {
      const potentialCommand = lowerTranscript.substring(this.hotword.length).trim();
      
      // Allow for slight variations like 'co-pilot' vs 'copilot'
      const normalizedCommand = potentialCommand.replace(/co-pilot/g, 'copilot');
      const targetCommand = this.commands.find(cmd => normalizedCommand.startsWith(cmd.replace(/co-pilot/g, 'copilot')));

      if (targetCommand) {
        return targetCommand;
      }
    }
    
    return null;
  }
}

export const commandService = new CommandService();
