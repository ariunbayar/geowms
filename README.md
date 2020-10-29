`py_pgrest` функцыг үүсгэх:

```sh
pip3 install requests
sudo apt install postgresql-plpython3-12
```

```sql
CREATE EXTENSION plpython3u WITH SCHEMA pg_catalog;
CREATE FUNCTION public.py_pgrest(uri text, body text DEFAULT NULL::text, content_type text DEFAULT 'application/json'::text) RETURNS text
    LANGUAGE plpython3u
AS $$
    import requests
    headers = {'Content-Type': content_type}
    try:
        rsp = requests.post(uri, data=body, headers=headers)
    except Exception as e:
        if hasattr(e, 'reason'):
            return e.reason
        elif hasattr(e, 'code'):
            return e.code
        else:
            return e
    else:
        return rsp.content
$$;
```
