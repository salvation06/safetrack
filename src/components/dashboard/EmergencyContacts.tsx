import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Users } from 'lucide-react';

export const EmergencyContacts = () => {
  const contacts = [
    { name: 'Primary Guardian', phone: '(555) 123-4567', role: 'Parent' },
    { name: 'Secondary Guardian', phone: '(555) 987-6543', role: 'Partner' },
    { name: 'Emergency Services', phone: '911', role: 'Emergency' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          >
            <div>
              <div className="font-medium text-sm">{contact.name}</div>
              <div className="text-xs text-muted-foreground">{contact.role}</div>
            </div>
            <Button size="sm" variant="outline" className="gap-2">
              <Phone className="h-3 w-3" />
              {contact.phone}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
