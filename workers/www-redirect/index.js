// www.luitiescobar.com → luitiescobar.com (permanent, keeps path and query)
export default {
  fetch(request) {
    const url = new URL(request.url);
    url.hostname = 'luitiescobar.com';
    return Response.redirect(url.toString(), 301);
  },
};
