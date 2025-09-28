import { useContext } from 'react';
import { EventContext } from '@/contexts/event-context';
import { useToast } from '@/hooks/use-toast';

interface RegisterStudentParams {
  eventId: string;
  eventName: string;
  studentName: string;
  studentEmail: string;
  studentRollNo: string;
}

export function useRegistration() {
  const eventContext = useContext(EventContext);
  const { toast } = useToast();

  const registerStudent = async ({
    eventId,
    eventName,
    studentName,
    studentEmail,
    studentRollNo
  }: RegisterStudentParams): Promise<boolean> => {
    if (!eventContext) {
      toast({
        title: "Error",
        description: "Registration system is not available.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Check if the student is already registered
      if (eventContext.isUserRegistered(eventId, studentEmail)) {
        toast({
          title: "Already Registered",
          description: "This student is already registered for this event.",
          variant: "destructive",
        });
        return false;
      }

      // Add the student registration
      eventContext.addStudentRegistration({
        name: studentName,
        email: studentEmail,
        rollNo: studentRollNo,
        eventId,
        eventName
      });

      // Also register the user in the event
      eventContext.registerForEvent(eventId, studentEmail);

      toast({
        title: "Registration Successful",
        description: `${studentName} has been registered for ${eventName}.`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error processing the registration. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { registerStudent };
}