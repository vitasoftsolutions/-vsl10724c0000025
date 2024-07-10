export function organizeAttachments(attachments = []) {
  const result = {
    attach_file: [],
    attachments: [],
  };

  attachments.forEach((attachment) => {
    if (attachment?.label === "attach_file") {
      result.attach_file.push(attachment);
    } else if (attachment?.label === "attachments") {
      result.attachments.push(attachment);
    }
  });

  return result;
}
