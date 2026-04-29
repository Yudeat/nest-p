import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor("REMINDER_SERVICE")
export class ReminderProcessor extends WorkerHost{
  async process(job: Job<any, any, string>): Promise<any> {
    return this.sendReminder(job);
  }
  async sendReminder(job: Job<any, any, string>): Promise<any> {
    const { profileId } = job.data;
  console.log(`Sending reminder for profile with id ${profileId}`);
  // Here you can implement the logic to send the reminder email, e.g., using a mailer service
  // For demonstration purposes, we'll just log the action
  console.log(`Reminder sent for profile with id ${profileId}`);
  return { success: true };
  }
}